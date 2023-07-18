import React from 'react';
import styled from 'styled-components';
import { ContentBoxGrid, ContentCentered, ContentColumn, ContentColumns, ExternalLink, Spacer, Title, Text } from '../../components';
import { theme } from '../../theme';
import { dummyGraph, fudizardPng } from '../../assets';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Stats: React.FC<any> = () => {
	return (
		<ContentColumns
			mobileStyle={{marginTop: "5em", marginBottom: "5em"}}
			desktopStyle={{marginTop: "17em", marginBottom: "4em"}}>
			<ContentColumn width="50%">
				<Title as="h2" align='left' font={theme.font.neometric} size='xxl' weight={900} lineHeight={1.04}>Get yours before it's gone!</Title>
				<Spacer size="md"/>
				<ContentColumns justify="space-between">
					<ContentColumn>
						<Text as="p" align='left' font={theme.font.spaceMace} underline>Golden Fudizard</Text>
					</ContentColumn>
					<ContentColumn tabletLStyle={{ maxWidth: '250px' }}>
						<StyledContentBoxGrid gridTemplate='"meta1 meta2 meta3"'>
							<div style={{ gridArea: "meta1" }}>
								<Text as="p">owners</Text>
								<Text as="p" size='xl' font={theme.font.neometric} weight={900}>28</Text>
							</div>
							<div style={{ gridArea: "meta2" }}>
								<Text as="p">total</Text>
								<Text as="p" size='xl' font={theme.font.neometric} weight={900}>30</Text>
							</div>
							<div style={{ gridArea: "meta3" }}>
								<Text as="p">last sold</Text>
								<Text as="p" size='xl' font={theme.font.neometric} weight={900}>2.8ETH</Text>
							</div>
						</StyledContentBoxGrid>
					</ContentColumn>
				</ContentColumns>
				<LazyLoadImage effect="blur" src={dummyGraph} alt="graph" width="880"/>
				<StyledExternalLink styling="button" style={{display: "inline-block", width: "100%"}} href="https://opensea.io/collection/pepemonfactory">
					Buy now
				</StyledExternalLink>
			</ContentColumn>
			<ContentColumn width="50%">
				<StyledImgContainer>
					<StyledImgContainerInner>
						<LazyLoadImage effect="blur" loading="lazy" src={fudizardPng} alt="fudizard"/>
					</StyledImgContainerInner>
				</StyledImgContainer>
			</ContentColumn>
		</ContentColumns>
	)
}

const StyledExternalLink = styled(ExternalLink)`
	@media (max-width: ${theme.breakpoints.tabletL}) {
		max-width: 60%;
	}
`

const StyledContentBoxGrid = styled(ContentBoxGrid)`
	text-align: left;
	@media (min-width: ${theme.breakpoints.tabletL}) {
		text-align: center;
	}
`

const StyledImgContainer = styled.div`
	height: 100%;
	position: relative;
	width: 100%
`

const StyledImgContainerInner = styled(ContentCentered)`
	@media (max-width: ${theme.breakpoints.tabletL}) {
		max-width: 40%;
		position: absolute;
		right: 0;
		transform: translateY(-60%);
	}
`

export default Stats;
