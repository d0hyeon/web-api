import styled from '@emotion/styled';


export interface InputProps {
  full?: boolean;
  width?: number;
  height?: number; 
}

export const Input = styled.input<InputProps>`
  border: 1px solid #ddd;
  padding: 0 10px;
  line-height: 28px;

  ${({width, height, full}) => `
    width: ${full ? '100%' : (width ? `${width}px` : 'auto')}
    height: ${height ?? 30}px;
  `}
`