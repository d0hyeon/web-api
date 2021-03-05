export const createShader = (
  gl: WebGLRenderingContext, 
  type: 'fragment' | 'vertex', 
  source: string
): WebGLShader | null => {
  const shader = gl.createShader(
    gl[type === 'fragment' 
      ? 'FRAGMENT_SHADER'
      : 'VERTEX_SHADER'
    ]
  )
  if(shader) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return shader;
  }
  return null;
};

export const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = gl.createProgram();
  if(program) {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return program;
    }
  }
  return null;
}