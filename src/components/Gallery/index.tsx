// 3rd party libraries
import React, { ReactElement, ReactEventHandler, useState } from 'react';
import styled from 'styled-components';
// Swiper
import SwiperCore, { Navigation, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// Swiper CSS
// This is all the module's CSS (perhaps could be optimized)
import 'swiper/swiper-bundle.min.css';
// The core CSS
import 'swiper/swiper.min.css';
// Add in a few "modules"
SwiperCore.use([Navigation, Thumbs]);

const GalleryContainer = styled.div`
  width: 100%;
  max-width: 24rem;
  @media only screen and (min-width: 1200px) {
    max-width: 30rem;
  }
  @media only screen and (min-width: 2000px) {
    max-width: 40rem;
  }

  // Override Swiper's coloring
  --swiper-theme-color: #018cd8;

  // Tweak position of next/prev arrows
  & .swiper-button-next {
    right: 0.125rem;
  }

  & .swiper-button-prev {
    left: 0.125rem;
  }
`;

const GalleryImage = styled.div`
  // Add some padding to take into account carousel navigation
  padding: 0 2rem;

  & img {
    display: block;
    width: 100%;
  }
`;

const SingleImage = styled.div`
  padding: 0 2rem;
  width: 23.4375rem;
  height: 18.75rem;
  margin-right: 2rem;

  img {
    width: 100%;
  }
`;

const ThumbsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 0.75rem;

  & .swiper-slide {
    width: 2.75rem !important;
    height: 2.75rem;
    margin-right: 0.625rem;
    opacity: 0.35;
    border-radius: 0.3125rem;
    border: ${(props) => props.theme.colors.borders.nav.border};

    &last-child {
      margin-right: 0;
    }
  }

  & .swiper-slide-thumb-active {
    opacity: 1;
  }
`;

const ThumbImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  object-fit: contain;
  background-color: ${(props) => props.theme.colors.white};
  & img {
    display: block;
    width: 100%;
  }
`;

export interface Props {
  images: string[];
}

const placeholderPart = '/assets/placeholder/part.svg';

const handleImgError: ReactEventHandler<HTMLImageElement> = (event) => {
  const img = event.target as HTMLImageElement;
  img.src = placeholderPart;
};

export default function Gallery({ images }: Props): ReactElement {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore>();

  return (
    <GalleryContainer>
      {images.length > 1 ? (
        <>
          <Swiper
            grabCursor={true}
            thumbs={{ swiper: thumbsSwiper }}
            slidesPerView={1}
            spaceBetween={16}
          >
            {images.map((image, i) => (
              <SwiperSlide key={i}>
                <GalleryImage>
                  <img src={image} onError={handleImgError} />
                </GalleryImage>
              </SwiperSlide>
            ))}
          </Swiper>
          <ThumbsContainer>
            <Swiper
              slidesPerView={images.length || 'auto'}
              freeMode={false}
              watchSlidesProgress={true}
              onSwiper={setThumbsSwiper}
            >
              {images.map((image, i) => (
                <SwiperSlide key={i}>
                  <ThumbImage>
                    <img src={image} onError={handleImgError} />
                  </ThumbImage>
                </SwiperSlide>
              ))}
            </Swiper>
          </ThumbsContainer>
        </>
      ) : (
        <SingleImage>
          <img src={images[0]} onError={handleImgError} />
        </SingleImage>
      )}
    </GalleryContainer>
  );
}
