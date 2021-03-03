import styled from '@emotion/styled';

export const H1 = styled.h1`
  font-size: 32px;
`;
export const H2 = styled.h2`
  font-size: 28px;
`;
export const H3 = styled.h3`
  font-size: 24px;
`;
export const H4 = styled.h4`
  font-size: 22px;
`;
export const H5 = styled.h5`
  font-size: 20px;
`;

export const P = styled.p`
  font-size: 18px;
  line-height: 1.4;

  & ~ & {
    margin-top: 8px;
  }
`;
export const Em = styled.em`
  color: #C43326;
  font-weight: inherit;
  font-style: normal;
`;

export const Code = styled.code`
  background-color: rgba(135,131,120,0.15);
  color: #C43326;
  font-size: 13px;
  padding: 3px;
  white-space: pre-wrap;
  word-break: break-word;
  vertical-align: middle;
  font-family: inherit;
`;
export const CodeKeyword = styled.span`
  color: #071D9B;
`;

export const CodeTitle = styled.span`
  color: #029316;
`;

export const CodeBlock = styled.span`
  color: #666;
`;

export const CodeValue = styled.span`
  color: #C43326;
`;



