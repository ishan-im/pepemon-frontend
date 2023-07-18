import React, { useContext } from 'react';
import styled from 'styled-components';
import { isMobile } from '../../../utils';
import {
	ExternalLink,
	ModalProps,
	NetworkSwitch,
	Text,
} from '../../../components';
import { PepemonProviderContext } from '../../../contexts';
import { theme } from '../../../theme';
import { chains } from '../../../constants';

interface WalletModalProps extends ModalProps {
	account: string,
	setChainId?: () => void,
	ppblzBalance?: any,
	nativeBalance?: string,
	totalPpblz?: string,
	totalPpdex?: string
	ppmnCardsOwned?: number
}

const WalletModal: React.FC<WalletModalProps> = ({
	account,
	setChainId,
	ppblzBalance,
	nativeBalance,
	totalPpblz,
	totalPpdex,
	ppmnCardsOwned,
}) => {
	const [{ chainId }] = useContext(PepemonProviderContext);

	const [currentChain] = chains.filter(
		(chain) => parseInt(chain.chainId) === chainId && chain.chainName
	);

	return (
		<>
			{ppblzBalance && (
				<StyledTextInfos>
					{isMobile() && (
						<>
							<dt>Change network:</dt>
							<dd>
								<NetworkSwitch
									{...{ appChainId: chainId, providerChainId: chainId }}
								/>
							</dd>
						</>
					)}
					<dt>Native balance</dt>
					<dd>{nativeBalance}</dd>
					<dt>In Wallet + Staked PPBLZ</dt>
					<dd>{totalPpblz}</dd>
					<dt>In Wallet + Not Claimed PPDEX</dt>
					<dd>{totalPpdex}</dd>
					<dt>Unique card{ppmnCardsOwned !== 1 && 's'}</dt>
					<dd>{ppmnCardsOwned}</dd>
				</StyledTextInfos>
			)}
			<CustomText
				font={theme.font.inter}
				size='s'
				color={theme.color.gray[600]}>
				View your account on{' '}
				<ExternalLink
					href={`${currentChain?.blockExplorerUrls}/address/${account}`}>
					{currentChain?.blockExplorerTitle}
				</ExternalLink>
			</CustomText>
		</>
	);
};

export const StyledTextInfos = styled.dl`
	& {
		font-family: ${theme.font.inter};
		margin-bottom: 0;
	}

	& dt {
		color: ${theme.color.gray[300]};
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 1.2px;
	}

	& dd {
		color: ${theme.color.gray[600]};
		font-size: 1.2rem;
		font-weight: bold;
		margin-bottom: 1em;
		margin-left: 0;
		margin-top: 0.2em;
	}
`

const CustomText = styled(Text)`
	@media (min-width: ${theme.breakpoints.tabletL}) {
		text-align: center;
	}
`;

export default WalletModal;
