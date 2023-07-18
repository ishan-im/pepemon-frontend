import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Title, Spacer, DropdownMenu,
	// Button
} from '../../../components';
import { PepemonProviderContext } from '../../../contexts';
import { cards } from '../../../constants';
import { theme } from '../../../theme';
import { CardSingle, StyledStoreCardsWrapper, StyledStoreCardsInner, StoreSelectionWrapper } from '../components';

const StoreCardsCollection : React.FC<any> = ({selectedCard, setSelectedCard}) => {
	const [pepemon] = useContext(PepemonProviderContext);
	const { chainId } = pepemon;
	const [options, setOptions] = useState<any>(null);
	const [activeSeries, setActiveSeries] = useState<any>(cards.get(chainId)?.find(series => {
																if (chainId === 56) {
																	return series.title_formatted === 'CARTOONIZED_SERIES'
																}
																return series.title_formatted === 'EVENT_ITEM_CARDS'
															}));




	useEffect(() => {
		setActiveSeries( cards.get(chainId)?.find(series => {
			if (chainId === 56) {
				return series.title_formatted === 'CARTOONIZED_SERIES'
			}
			return series.title_formatted === 'EVENT_ITEM_CARDS'
		}))
	},[setActiveSeries, chainId])

	useEffect(() => {
		setSelectedCard(null);
	},[setSelectedCard, chainId])

	useEffect(() => {
		setOptions((prevOptions:any) => {
		  const newOptions = (cards.get(chainId) || []).map((series: any) => ({
			title: series.title,
			onClick: () => setActiveSeries(series),
		  }));
		  return newOptions;
		});
	  }, [chainId, setActiveSeries]);
	  
	  const routerParams: any = useParams();

	  useEffect(() => {
		setSelectedCard(null);
	}, [setSelectedCard, routerParams,activeSeries]);

	return (
		<div>
			<StoreSelectionWrapper>
				{/*<Button styling="link" style={{padding: 0}} onClick={selectAllSeries}>show series</Button>*/}
				{(activeSeries && options) && <DropdownMenu title="0 Selected" options={options} activeOptions={activeSeries} setActiveSeries={setActiveSeries}/>}
			</StoreSelectionWrapper>
			{/*{seriesToMap.map((activeSerie, key) => {
				return (
					<div key={key}>*/}
					{ activeSeries &&
						<StyledStoreCardsWrapper>
							<Title as="h3" size='m' font={theme.font.spaceMace}>{activeSeries.title}</Title>
							<Spacer size="md"/>
							<StyledStoreCardsInner gridCols={selectedCard ? 3 : 5}>
								{activeSeries.cards.map((cardId:any )=> {
									return <CardSingle key={cardId} cardId={cardId} selectedCard={selectedCard} selectCard={setSelectedCard}/>
								})}
							</StyledStoreCardsInner>
							<Spacer size="md"/>
						</StyledStoreCardsWrapper>
					}
				{/*)
			})}*/}
		</div>
	)
}

export default StoreCardsCollection;
