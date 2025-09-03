const regexLookbehindAvailable: boolean = ((): boolean => {
  try {
    return "ab".replace(/(?<=a)b/g, "c") === "ac";
  } catch {
    return false;
  }
})();

const MATCH_BEHIND = regexLookbehindAvailable ? "(?<=^|\\s)" : "";

const MENTION_NAMESPACE = "\\w+\\/";
const MENTION_BODY = "([\\dA-Za-z]\\w{2,25})";

export const RegEx = {
  CASHTAG: /(\$\w*[A-Za-z]\w*)/g,
  HASHTAG: /(#\w*[A-Za-z]\w*)/g,
  MENTION: new RegExp(`${MATCH_BEHIND}@${MENTION_NAMESPACE}${MENTION_BODY}`, "g"),
  URL: /\b(http|https):\/\/([\p{L}\p{N}_-]+(?:(?:\.[\p{L}\p{N}_-]+)+))([\p{L}\p{N}_.,@?^=%&:\/~+#-]*[\p{L}\p{N}_@?^=%&\/~+#-])/gu,
};
