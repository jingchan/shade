export const testVertexSize = 4 * (4 + 2);
export const testPositionOffset = 0;
export const testUvOffset = 4 * 4; // Byte offset of test vertex color attribute.
export const testVertexCount = 6;

// prettier-ignore
export const testVertexArray = new Float32Array([
  // position, uv
  -1.0,  1.0,  0.0,  1.0,   0.0,  0.0,  // Top Left
  -1.0, -1.0,  0.0,  1.0,   0.0,  1.0,  // Bottom Left
   1.0,  1.0,  0.0,  1.0,   1.0,  0.0,  // Top Right

   1.0,  1.0,  0.0,  1.0,   1.0,  0.0,  // Top Right
  -1.0, -1.0,  0.0,  1.0,   0.0,  1.0,  // Bottom Left
   1.0, -1.0,  0.0,  1.0,   1.0,  1.0,  // Bottom Right
]);
