"use client";

import { InstallCommandBlock } from "@/components/install-command-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york/ui/table";

export function Utils() {
  return (
    <div className="flex flex-col flex-1 gap-8">
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Installation</h2>
      <InstallCommandBlock componentName="utils" />
      <h2 className="mt-6 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Usage</h2>
      <h3 className="pb-2 text-2xl font-semibold tracking-tight first:mt-0">Constants</h3>
      <p className="content !mt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>ZeroAddress</code>
              </TableCell>
              <TableCell>
                A zero address equivalent to <code>address(0)</code> in Solidity
              </TableCell>
              <TableCell className="text-right">
                <code>string</code>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>NativeToken</code>
              </TableCell>
              <TableCell>The EVM address of the native token</TableCell>
              <TableCell className="text-right">
                <code>string</code>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </p>
      <h3 className="mt-6 pb-2 text-2xl font-semibold tracking-tight first:mt-0">Functions</h3>
      <p className="content !mt-0">
        <h4 className="pb-2 text-xl font-semibold tracking-tight first:mt-0">
          truncateAddress <code className="text-base ml-2">string</code>
        </h4>
        <p className="!mt-0">Truncate a string to a maximum length, adding an ellipsis in the middle</p>
        <p className="mt-2 pb-2 font-semibold tracking-tight first:mt-0">Props</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Default Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>address</code>
              </TableCell>
              <TableCell>
                <code>string</code>
              </TableCell>
              <TableCell>The string to truncate.</TableCell>
              <TableCell className="text-right">-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>maxLength</code>
              </TableCell>
              <TableCell>
                <code>number</code>
              </TableCell>
              <TableCell>The length of the result, excluding the ellipsis and 0x prefix</TableCell>
              <TableCell className="text-right">8</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </p>
      <p className="content">
        <h4 className="pb-2 text-xl font-semibold tracking-tight first:mt-0">
          parseUri <code className="text-base ml-2">string</code>
        </h4>
        <p className="!mt-0">Parse a URI and convert it to a gateway URL if it is an IPFS, Arweave, or Lens URL.</p>
        <p className="mt-2 pb-2 font-semibold tracking-tight first:mt-0">Props</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>uri</code>
              </TableCell>
              <TableCell>
                <code>string</code>
              </TableCell>
              <TableCell>The URI to parse.</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </p>
      <p className="content">
        <h4 className="pb-2 text-xl font-semibold tracking-tight first:mt-0">
          getCidFromIpfsUrl <code className="text-base ml-2">string</code>
        </h4>
        <p className="!mt-0">Extract the CID from an IPFS URL.</p>
        <p className="mt-2 pb-2 font-semibold tracking-tight first:mt-0">Props</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>ipfsUrl</code>
              </TableCell>
              <TableCell>
                <code>string</code>
              </TableCell>
              <TableCell>The IPFS URL to extract the CID from.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </p>
      <p className="content">
        <h4 className="pb-2 text-xl font-semibold tracking-tight first:mt-0">
          ipfsUrlToGatewayUrl <code className="text-base ml-2">string</code>
        </h4>
        <p className="!mt-0">Convert an IPFS URL to a gateway URL.</p>
        <p className="mt-2 pb-2 font-semibold tracking-tight first:mt-0">Props</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>ipfsUrl</code>
              </TableCell>
              <TableCell>
                <code>string</code>
              </TableCell>
              <TableCell>The IPFS URL to convert.</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>gatewayDomain</code>
              </TableCell>
              <TableCell>
                <code>string</code>
              </TableCell>
              <TableCell>The gateway domain to use.</TableCell>
              <TableCell>https://ipfs.io/ipfs/</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </p>
      <p className="content">
        <h4 className="pb-2 text-xl font-semibold tracking-tight first:mt-0">
          arweaveUrlToGatewayUrl <code className="text-base ml-2">string</code>
        </h4>
        <p className="!mt-0">Convert an Arweave URL to a gateway URL.</p>
        <p className="mt-2 pb-2 font-semibold tracking-tight first:mt-0">Props</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>arUrl</code>
              </TableCell>
              <TableCell>
                <code>string</code>
              </TableCell>
              <TableCell>The IPFS URL to convert.</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>gatewayDomain</code>
              </TableCell>
              <TableCell>
                <code>string</code>
              </TableCell>
              <TableCell>The gateway domain to use.</TableCell>
              <TableCell>https://arweave.net/</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </p>
      <p className="content">
        <h4 className="pb-2 text-xl font-semibold tracking-tight first:mt-0">
          lensUrlToGatewayUrl <code className="text-base ml-2">string</code>
        </h4>
        <p className="!mt-0">Convert an Lens URL to a gateway URL.</p>
        <p className="mt-2 pb-2 font-semibold tracking-tight first:mt-0">Props</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>lensUrl</code>
              </TableCell>
              <TableCell>
                <code>string</code>
              </TableCell>
              <TableCell>The Lens URL to convert.</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>gatewayDomain</code>
              </TableCell>
              <TableCell>
                <code>string</code>
              </TableCell>
              <TableCell>The gateway domain to use.</TableCell>
              <TableCell>https://api.grove.storage/</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </p>
      <p className="content">
        <h4 className="pb-2 text-xl font-semibold tracking-tight first:mt-0">
          formatFollowerCount <code className="text-base ml-2">string</code>
        </h4>
        <p className="!mt-0">Format a follower count as a string, using "k" for thousands and "m" for millions.</p>
        <p className="mt-2 pb-2 font-semibold tracking-tight first:mt-0">Props</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>count</code>
              </TableCell>
              <TableCell>
                <code>number</code>
              </TableCell>
              <TableCell>The follower count to format.</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </p>
    </div>
  );
}
