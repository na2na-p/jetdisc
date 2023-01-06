import { DLSITE_URI_BASE, DLSITE_URI_PREFIX } from './CONSTANTS.js';

type pageType = 'detail' | 'cart';
const createDlsiteUri = (id: string, type: pageType = 'detail') => {
	return type === 'detail'
		? `${DLSITE_URI_BASE}${DLSITE_URI_PREFIX[0]}/work/=/product_id/${id}.html`
		: `${DLSITE_URI_BASE}${DLSITE_URI_PREFIX[0]}/cart/=/product_id/${id}.html`;
};

export default createDlsiteUri;
