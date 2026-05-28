export const sanitizeCode = (code) => {
  const dangerousPatterns = [
    { regex: /localStorage\.clear\(\)/g, replacement: "// Security Blocked: localStorage.clear()" },
    { regex: /eval\(/g, replacement: "// Security Blocked: eval()" },
    { regex: /<script/g, replacement: "&lt;script" }
  ];

  let sanitized = code;
  dangerousPatterns.forEach(p => {
    sanitized = sanitized.replace(p.regex, p.replacement);
  });

  return sanitized;
};
