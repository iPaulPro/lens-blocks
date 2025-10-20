import { InstallCommandBlock } from "@/components/install-command-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york/ui/table";
import { readFileSync } from "fs";
import path from "path";
import * as ts from "typescript";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Param {
  name: string;
  type: string;
  description: string;
  default?: string;
}

interface Utility {
  name: string;
  description: string;
  params: Param[];
  isConstant: boolean;
  returnType: string;
}

function parseUtilitiesFromFile(filePath: string): Utility[] {
  const fileContent = readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.ESNext, true);
  const utilities: Utility[] = [];

  ts.forEachChild(sourceFile, node => {
    if (ts.isVariableStatement(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      const jsDoc = (node as any).jsDoc as ts.JSDoc[] | undefined;
      const description = jsDoc?.[0]?.comment ? (jsDoc[0].comment as string).trim() : "";

      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) {
          const name = decl.name.text;
          const params: Param[] = [];
          const isConstant = !decl.initializer || !ts.isArrowFunction(decl.initializer);
          let returnType = "";

          if (decl.initializer && ts.isArrowFunction(decl.initializer)) {
            returnType = decl.initializer.type ? decl.initializer.type.getText(sourceFile) : "void";
            const jsDocTags = jsDoc?.[0]?.tags ?? [];
            decl.initializer.parameters.forEach(param => {
              const paramName = (param.name as ts.Identifier).text;
              const paramType = param.type ? param.type.getText(sourceFile) : "any";
              const paramDoc = jsDocTags.find(
                (tag: ts.JSDocTag) => ts.isJSDocParameterTag(tag) && tag.name.getText(sourceFile) === paramName,
              ) as ts.JSDocParameterTag | undefined;
              const paramDescription = paramDoc?.comment ? (paramDoc.comment as string).trim() : "";
              const paramDefault = param.initializer ? param.initializer.getText(sourceFile) : undefined;

              params.push({
                name: paramName,
                type: paramType,
                description: paramDescription,
                default: paramDefault,
              });
            });
          }

          utilities.push({
            name,
            description,
            params,
            isConstant,
            returnType,
          });
        }
      }
    }
  });

  return utilities;
}

export function Utils() {
  const utilsFilePath = path.join(process.cwd(), "registry/new-york/lib/lens-utils.ts");
  const utilities = parseUtilitiesFromFile(utilsFilePath);
  const sortedUtils = utilities.sort((a, b) => a.name.localeCompare(b.name));

  const constants = sortedUtils.filter(util => util.isConstant);
  const functions = sortedUtils.filter(util => !util.isConstant);

  return (
    <div className="flex flex-col flex-1 gap-8">
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="utils" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <p>The utilities provided in this module can be imported and used in your project as follows:</p>
      {constants.length > 0 && (
        <>
          <h3 className="pb-2 text-2xl font-semibold tracking-tight first:mt-0">Constants</h3>
          <div className="content !mt-0">
            <Table className="border rounded-lg border-separate border-spacing-y-1">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {constants.map(util => (
                  <TableRow key={util.name}>
                    <TableCell className="border-t">
                      <code>{util.name}</code>
                    </TableCell>
                    <TableCell className="border-t">{util.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {functions.length > 0 && (
        <>
          <h3 className="mt-6 pb-2 text-2xl font-semibold tracking-tight first:mt-0">Functions</h3>
          {functions.map(util => (
            <div key={util.name} className="content !mt-0">
              <h4 className="pb-2 text-xl font-semibold tracking-tight first:mt-0">
                {util.name} <code className="text-base ml-2">{util.returnType}</code>
              </h4>
              <p className="!mt-0">{util.description}</p>
              {util.params.length > 0 && (
                <>
                  <p className="mt-2 pb-2 font-semibold tracking-tight first:mt-0">Props</p>
                  <Table className="border rounded-lg border-separate border-spacing-y-1">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prop</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {util.params.map(param => (
                        <TableRow key={param.name}>
                          <TableCell className="border-t">
                            <code>{param.name}</code>
                          </TableCell>
                          <TableCell className="border-t max-w-64 whitespace-normal break-words">
                            <Markdown remarkPlugins={[remarkGfm]}>{param.description}</Markdown>
                          </TableCell>
                          <TableCell className="border-t">
                            <code>{param.type}</code>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
