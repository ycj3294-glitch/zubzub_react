import styled from "styled-components";

const Container = styled.div``;

const MainImg = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  width: 60%;
  height: 50%;

  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
`;

const Main = () => {
  return (
    <Container>
      <MainImg>
        <img src="/images/Component1.png" alt="dd" />
      </MainImg>
    </Container>
  );
};

export default Main;
