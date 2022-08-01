import styled from "styled-components";


interface NFTArtworkProps {
  maxWidth?: number,
  maxWidthMobile?: number
}


export const ArtworkImage = styled.video<NFTArtworkProps>`
  max-width: ${p=> p.maxWidth || 430}px;
  width: 100%;
  border-radius: 30px 30px 0 0;
  min-width: 430px;
  min-height: 430px;

  @media screen and (max-width: 900px){
    max-width: ${p=> p.maxWidthMobile || 350}px;
    min-width: 300px;
  }
`

export const BoxShadowShiny = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  border-radius: 30px;
`