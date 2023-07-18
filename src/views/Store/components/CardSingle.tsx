import React, { useEffect, useCallback, useContext, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { cardback_normal, coin } from "../../../assets";
import { Title, Spacer, StyledSpacer } from "../../../components";
import { getDisplayBalance } from "../../../utils";
import { theme } from "../../../theme";
import {
  getCardMeta,
  getCardFactoryData,
  getCardStorePrices,
} from "../../../hooks";
import { PepemonProviderContext } from "../../../contexts";
import { LazyLoadImage } from "react-lazy-load-image-component";

const CardSingle: React.FC<any> = ({ cardId, selectedCard, selectCard }) => {
  const [pepemon] = useContext(PepemonProviderContext);
  const { chainId } = pepemon;
  const [isLoaded, setIsLoaded] = useState(false);
  const [cardPrice, setCardPrice] = useState<{ tokenId: number; price: BigNumber } | null>(null);
  const [cardMeta, setCardMeta] = useState<any | null>(null);
  const [cardBalance, setCardBalance] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedCardMeta = await getCardMeta(cardId, pepemon);
      const fetchedCardPrice = await getCardStorePrices(cardId, pepemon);
      const fetchedCardBalance = await getCardFactoryData(cardId, pepemon, 0);
  
      if (fetchedCardMeta && fetchedCardPrice && fetchedCardBalance) {
        setCardMeta(fetchedCardMeta);
        setCardPrice(fetchedCardPrice);
        setCardBalance(fetchedCardBalance);
      }
      setIsLoaded(true);
    })();
  }, [cardId, pepemon]);

  const priceOfCard = cardPrice && cardPrice.price
  ? parseFloat(getDisplayBalance(cardPrice.price, 18) || '0').toFixed(2)
  : '0';



const isSoldOut = () => {
  if (!cardBalance || cardBalance.length === 0) return true;
  return (
    cardBalance[0]?.totalSupply === parseFloat(cardBalance[0]?.maxSupply || '0')
  );
};



  

  const isReleasingSoon = useCallback(() => {
    const birthdayMetaData = cardMeta?.attributes.find(
      (attribute:any) => attribute.trait_type === "birthday"
    );
    if (parseFloat(birthdayMetaData?.value) === 0) {
      return true;
    }
    return parseFloat(birthdayMetaData?.value) > Date.now() / 1000;
  }, [cardMeta]);

  const isItemCard = (tokenId: number) => {
    return [17, 18, 19].includes(tokenId);
  };

  const daysForSale = useCallback(() => {
    if (isItemCard(cardId)) {
      return 1000000;
    }
    return cardId > 5 ? (cardId > 12 ? 28 : 21) : 14;
  }, [cardId]);

  const calculateTimeLeft = useCallback(() => {
    const birthdayMetaData = cardMeta?.attributes.find(
      (attribute:any) => attribute.trait_type === "birthday"
    );
    if (parseFloat(birthdayMetaData?.value) === 0) {
      return 0;
    }

    if (isReleasingSoon()) {
      return parseFloat(birthdayMetaData?.value) - Date.now() / 1000;
    }

    if (
      parseFloat(birthdayMetaData?.value) +
        daysForSale() * 60 * 60 * 24 -
        Date.now() / 1000 <=
      0
    ) {
      return 0;
    }
    return (
      parseFloat(birthdayMetaData?.value) +
      daysForSale() * 60 * 60 * 24 -
      Date.now() / 1000
    );
  }, [cardMeta, daysForSale, isReleasingSoon]);

  const countdown = (pre: string = " ", after: string = "") => {
    const timeLeft = calculateTimeLeft();

    const days = timeLeft / (60 * 60 * 24);
    if (days > 1) {
      return (
        <span>
          {Math.ceil(days).toFixed(0)}
          {pre} {Math.ceil(days).toFixed(0) === "1" ? "day" : "days"} {after}
        </span>
      );
    }

    const hours = timeLeft / (60 * 60);
    if (hours > 1) {
      return (
        <span>
          {Math.ceil(hours).toFixed(0)}
          {pre} {Math.ceil(hours).toFixed(0) === "1" ? "hour" : "hours"} {after}
        </span>
      );
    }

    const minutes = timeLeft / 60;
    if (minutes <= 0) {
      return null;
    }

    return (
      <span>
        {minutes.toFixed(0)}
        {pre} {minutes.toFixed(0) === "1" ? "minute" : "minutes"} {after}
      </span>
    );
  };

  if (cardMeta?.status === "failed") return <></>;

  const self = {
    cardId: cardId && cardId,
    cardPrice: cardPrice && cardPrice?.price,
    cardMeta: cardMeta && cardMeta,
    cardBalance: cardBalance && cardBalance[0],
  };

  return (
    <StyledPepemonCard
      style={{
        opacity: !isSoldOut() && isLoaded && countdown() ? "100%" : "60%",
      }}
      isLoaded={isLoaded}
    >
      <StyledPepemonCardPrice>
        <img loading="lazy" src={coin} alt="coin" />
        {cardPrice
          ? `${priceOfCard} ${chainId === 56 ? "BNB" : "PPDEX"}`
          : "loading"}
      </StyledPepemonCardPrice>
      <div>
        <StyledPepemonCardImage
          width="747"
          height="1038"
          effect="blur"
          active={cardId === selectedCard?.cardId}
          src={cardMeta ? cardMeta.image : cardback_normal}
          alt={cardMeta ? cardMeta.name : "Loading card"}
          onClick={() => isLoaded && selectCard(self)}
        />
        <Title as="h4" font={theme.font.neometric}>
          {cardMeta ? cardMeta.name : "Loading"}
        </Title>
        <StyledSpacer bg={theme.color.gray[100]} size={2} />
        <Spacer size="sm" />
        <StyledPepemonCardMeta>
          <dt>Minted</dt>
          <dd>
            {cardBalance === null
              ? "loading"
              : `${parseFloat(cardBalance[0]?.totalSupply)} / ${
                  parseFloat(cardBalance[0]?.maxSupply) > 10000
                    ? "♾️"
                    : parseFloat(cardBalance[0]?.maxSupply)
                }`}
          </dd>
        </StyledPepemonCardMeta>
        <StyledPepemonCardMeta>
          <dt>Time</dt>
          <dd>{countdown() ? countdown() : "Not available"}</dd>
        </StyledPepemonCardMeta>
      </div>
    </StyledPepemonCard>
  );
};

const StyledPepemonCard = styled.div<{ isLoaded: boolean }>`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;

  & {
    cursor: ${({ isLoaded }) => (isLoaded ? "pointer" : "not-allowed")};
  }
`;

export const StyledPepemonCardPrice = styled.span<{ styling?: string }>`
  & {
    background-color: ${(props) =>
      props.styling === "alt"
        ? props.theme.color.white
        : props.theme.color.black};
    color: ${(props) =>
      props.styling === "alt"
        ? props.theme.color.black
        : props.theme.color.white};
    font-family: ${(props) => props.theme.font.spaceMace};
    border-radius: 6px;
    display: inline-flex;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    padding: ${(props) => (props.styling === "alt" ? "" : "2px 8px")};
    font-size: ${(props) => (props.styling === "alt" ? "1rem" : ".8rem")};
    transform: ${(props) => (props.styling === "alt" ? "" : "translateY(40%)")};
    position: relative;
    z-index: 1;
  }

  & img {
    width: 1.8em;
  }
`;

export const StyledPepemonCardImage = styled(LazyLoadImage)<{
  active?: boolean;
}>`
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
  height: auto;
  max-width: 25em;
  position: relative;
  width: 100%;
  z-index: 0;
  transition: filter 0.2s ease-in-out;

  ${({ active }) =>
    active &&
    `
		&{
			filter: drop-shadow(0 0 50px #894fbe);
		}
	`}
`;

export const StyledPepemonCardMeta = styled.dl`
  & {
    display: flex;
    font-family: ${(props) => props.theme.font.inter};
    justify-content: space-between;
    margin-bottom: 0;
    margin-top: 0;
  }

  & dt,
  dd {
    font-size: 0.8rem;
    margin-top: 0.5em;
  }

  & dt {
    color: ${(props) => props.theme.color.gray[300]};
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }

  & dd {
    color: ${(props) => props.theme.color.gray[600]};
    font-weight: bold;
    text-align: right;
  }
`;

export default CardSingle;
