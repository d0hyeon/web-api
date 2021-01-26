import styled from '@emotion/styled';

export const Header = styled.header`
  margin-bottom: 40px;
  h1, h2 {
    margin-bottom: 10px;
  }

  p {
    line-height: 1.6;
    font-size: 16px;

    & ~ p {
      margin-top: 5px;
    }
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
