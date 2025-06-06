/** @param {string} countryCode */
function getFlagEmoji(countryCode) {
	if (countryCode.length !== 2) return '';
	return countryCode
		.toUpperCase()
		.split('')
		.map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
		.join('');
}

// Full list of countries with flag emoji and dial code.
// (Dial codes are approximations taken from public sources.)
export default [
	{ code: 'US', flag: getFlagEmoji('US'), dialCode: '+1' },
	{ code: 'CA', flag: getFlagEmoji('CA'), dialCode: '+1' },
	// { code: 'BS', flag: getFlagEmoji('BS'), dialCode: '+1-242' },
	// { code: 'BB', flag: getFlagEmoji('BB'), dialCode: '+1-246' },
	// { code: 'AI', flag: getFlagEmoji('AI'), dialCode: '+1-264' },
	// { code: 'AG', flag: getFlagEmoji('AG'), dialCode: '+1-268' },
	// { code: 'BM', flag: getFlagEmoji('BM'), dialCode: '+1-441' },
	// { code: 'GD', flag: getFlagEmoji('GD'), dialCode: '+1-473' },
	// { code: 'MS', flag: getFlagEmoji('MS'), dialCode: '+1-664' },
	// { code: 'DM', flag: getFlagEmoji('DM'), dialCode: '+1-767' },
	// { code: 'LC', flag: getFlagEmoji('LC'), dialCode: '+1-758' },
	// { code: 'VC', flag: getFlagEmoji('VC'), dialCode: '+1-784' },
	// { code: 'TT', flag: getFlagEmoji('TT'), dialCode: '+1-868' },
	// { code: 'KN', flag: getFlagEmoji('KN'), dialCode: '+1-869' },
	// { code: 'DO', flag: getFlagEmoji('DO'), dialCode: '+1-809' },
	// { code: 'PR', flag: getFlagEmoji('PR'), dialCode: '+1-787' },
	// { code: 'JM', flag: getFlagEmoji('JM'), dialCode: '+1-876' },
	// { code: 'GP', flag: getFlagEmoji('GP'), dialCode: '+590' },
	{ code: 'MX', flag: getFlagEmoji('MX'), dialCode: '+52' },
	{ code: 'AR', flag: getFlagEmoji('AR'), dialCode: '+54' },
	{ code: 'BR', flag: getFlagEmoji('BR'), dialCode: '+55' },
	{ code: 'CL', flag: getFlagEmoji('CL'), dialCode: '+56' },
	{ code: 'CO', flag: getFlagEmoji('CO'), dialCode: '+57' },
	{ code: 'VE', flag: getFlagEmoji('VE'), dialCode: '+58' },
	{ code: 'GR', flag: getFlagEmoji('GR'), dialCode: '+30' },
	{ code: 'NL', flag: getFlagEmoji('NL'), dialCode: '+31' },
	{ code: 'BE', flag: getFlagEmoji('BE'), dialCode: '+32' },
	{ code: 'FR', flag: getFlagEmoji('FR'), dialCode: '+33' },
	{ code: 'ES', flag: getFlagEmoji('ES'), dialCode: '+34' },
	{ code: 'HU', flag: getFlagEmoji('HU'), dialCode: '+36' },
	{ code: 'IT', flag: getFlagEmoji('IT'), dialCode: '+39' },
	{ code: 'RO', flag: getFlagEmoji('RO'), dialCode: '+40' },
	{ code: 'CH', flag: getFlagEmoji('CH'), dialCode: '+41' },
	{ code: 'AT', flag: getFlagEmoji('AT'), dialCode: '+43' },
	{ code: 'GB', flag: getFlagEmoji('GB'), dialCode: '+44' },
	{ code: 'DK', flag: getFlagEmoji('DK'), dialCode: '+45' },
	{ code: 'SE', flag: getFlagEmoji('SE'), dialCode: '+46' },
	{ code: 'NO', flag: getFlagEmoji('NO'), dialCode: '+47' },
	{ code: 'PL', flag: getFlagEmoji('PL'), dialCode: '+48' },
	{ code: 'DE', flag: getFlagEmoji('DE'), dialCode: '+49' },
	{ code: 'PE', flag: getFlagEmoji('PE'), dialCode: '+51' },
	{ code: 'BO', flag: getFlagEmoji('BO'), dialCode: '+591' },
	{ code: 'GY', flag: getFlagEmoji('GY'), dialCode: '+592' },
	{ code: 'EC', flag: getFlagEmoji('EC'), dialCode: '+593' },
	{ code: 'PY', flag: getFlagEmoji('PY'), dialCode: '+595' },
	{ code: 'UY', flag: getFlagEmoji('UY'), dialCode: '+598' },
	{ code: 'SR', flag: getFlagEmoji('SR'), dialCode: '+597' },
	{ code: 'PT', flag: getFlagEmoji('PT'), dialCode: '+351' },
	{ code: 'IE', flag: getFlagEmoji('IE'), dialCode: '+353' },
	{ code: 'IS', flag: getFlagEmoji('IS'), dialCode: '+354' },
	{ code: 'AL', flag: getFlagEmoji('AL'), dialCode: '+355' },
	{ code: 'MT', flag: getFlagEmoji('MT'), dialCode: '+356' },
	{ code: 'CY', flag: getFlagEmoji('CY'), dialCode: '+357' },
	{ code: 'FI', flag: getFlagEmoji('FI'), dialCode: '+358' },
	{ code: 'BG', flag: getFlagEmoji('BG'), dialCode: '+359' },
	{ code: 'LT', flag: getFlagEmoji('LT'), dialCode: '+370' },
	{ code: 'LV', flag: getFlagEmoji('LV'), dialCode: '+371' },
	{ code: 'EE', flag: getFlagEmoji('EE'), dialCode: '+372' },
	{ code: 'MD', flag: getFlagEmoji('MD'), dialCode: '+373' },
	{ code: 'AM', flag: getFlagEmoji('AM'), dialCode: '+374' },
	{ code: 'BY', flag: getFlagEmoji('BY'), dialCode: '+375' },
	{ code: 'AD', flag: getFlagEmoji('AD'), dialCode: '+376' },
	{ code: 'MC', flag: getFlagEmoji('MC'), dialCode: '+377' },
	{ code: 'SM', flag: getFlagEmoji('SM'), dialCode: '+378' },
	{ code: 'VA', flag: getFlagEmoji('VA'), dialCode: '+379' },
	{ code: 'UA', flag: getFlagEmoji('UA'), dialCode: '+380' },
	{ code: 'RS', flag: getFlagEmoji('RS'), dialCode: '+381' },
	{ code: 'ME', flag: getFlagEmoji('ME'), dialCode: '+382' },
	{ code: 'XK', flag: getFlagEmoji('XK'), dialCode: '+383' },
	{ code: 'HR', flag: getFlagEmoji('HR'), dialCode: '+385' },
	{ code: 'SI', flag: getFlagEmoji('SI'), dialCode: '+386' },
	{ code: 'BA', flag: getFlagEmoji('BA'), dialCode: '+387' },
	{ code: 'MK', flag: getFlagEmoji('MK'), dialCode: '+389' },
	{ code: 'LI', flag: getFlagEmoji('LI'), dialCode: '+423' },
	{ code: 'CZ', flag: getFlagEmoji('CZ'), dialCode: '+420' },
	{ code: 'SK', flag: getFlagEmoji('SK'), dialCode: '+421' },
	{ code: 'CR', flag: getFlagEmoji('CR'), dialCode: '+506' },
	{ code: 'PA', flag: getFlagEmoji('PA'), dialCode: '+507' },
	{ code: 'HT', flag: getFlagEmoji('HT'), dialCode: '+509' },
	{ code: 'SV', flag: getFlagEmoji('SV'), dialCode: '+503' },
	{ code: 'HN', flag: getFlagEmoji('HN'), dialCode: '+504' },
	{ code: 'NI', flag: getFlagEmoji('NI'), dialCode: '+505' },
	{ code: 'LU', flag: getFlagEmoji('LU'), dialCode: '+352' },
	{ code: 'BZ', flag: getFlagEmoji('BZ'), dialCode: '+501' },
	{ code: 'GT', flag: getFlagEmoji('GT'), dialCode: '+502' },
];