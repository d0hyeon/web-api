import styled from '@emotion/styled';

export const Header = styled.header`
  margin-bottom: 40px;
  h1, h2 {
    margin-bottom: 10px;
  }
`;


export const Section = styled.section`
  & ~ & {
    margin-top: 15px;
  }

  h2 {
    margin-bottom: 10px;
  }
`;


export const Button = styled.button`
  min-width: 100px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid #666;
  color: #666 ;
  line-height: 28px;
  font-size: 14px;
`;

export const Ul = styled.ul`
  padding-left: 5px;

  > li {
    position: relative;
    padding-left: 10px;
    font-size: 14px;
    line-height: 1.3;
    & ~ li {
      margin-top: 8px;
    }
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      content: '-';
    }
  }
`;

export const CodeBlock = styled.pre`
  display: block;
  background-color: rgba(135,131,120,0.15);
  line-height: 1.5;
  color: #333;
  padding: 10px;
  font-size: 16px;
  font-family: 'Do Hyeon', sans-serif;
`