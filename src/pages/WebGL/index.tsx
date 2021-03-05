import React from 'react';
import styled from '@emotion/styled';
import { Header, Section } from '@src/components/styles/common';
import { H1, P } from '@src/components/styles/text';
import { createShader, createProgram } from '@src/lib/webgl';
import Toggle from '@src/components/Toggle';

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  void main (void) {
    gl_FragColor = vec4(0.3, 0.5, 0.8, 1.0);
  }
`;

const VERTEX_SHADER_SOURCE = `
  attribute vec4 a_position;
  
  void main() {
    gl_Position = a_position;
  }
`

interface Props {
  width?: number;
  height?: number;
}

const WebGL: React.FC<Props> = ({width = 1100, height = 500}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [gl, setGL] = React.useState<null | WebGLRenderingContext>(null);
  
  React.useLayoutEffect(() => {
    setGL(canvasRef.current?.getContext('webgl') ?? null);
  }, [canvasRef, setGL]);

  const initBuffer = React.useCallback(() => {
    if(gl) {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      const positions = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0	
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }
  }, [gl]);

  React.useEffect(() => {
    if(gl) {
      const vertexShader = createShader(gl, 'vertex', VERTEX_SHADER_SOURCE);
      const fragmentShader = createShader(gl, 'fragment', FRAGMENT_SHADER_SOURCE);
      if(vertexShader && fragmentShader) {
        const program = createProgram(gl, vertexShader, fragmentShader);
        if(program) {
          const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
          initBuffer();
          gl.viewport(0, 0, width, height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.useProgram(program);
          gl.enableVertexAttribArray(positionAttributeLocation);
          gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
          gl.drawArrays(gl.TRIANGLES, 0, 4);
        }
      }
    }
  }, [gl, width, height, initBuffer]);

  return (
    <>
      <Header>
        <H1>WebGL</H1>
      </Header>
      <Section>
        <Toggle title={<P>느낀점</P>}>
          <P>잠깐 들여다 본 수준인데 너무 어렵다..</P>
          <P>아니 그냥 이해 자체가 어렵다....</P>
          <P>2d context도 쉽지 않았는데 WebGL은 어련하겠나..</P>
        </Toggle>
        <Canvas ref={canvasRef} width={width} height={height} />
      </Section>
    </>
  )
}

const Canvas = styled.canvas<Required<Props>>`
  ${({width, height}) => `
    width: ${width}px;
    height: ${height}px;
  `}
`

WebGL.displayName = 'WebGL';
export default WebGL;