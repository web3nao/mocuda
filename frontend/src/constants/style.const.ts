export const PRIMARY_COLOR_1_HEX = '#63B3ED'
export const PRIMARY_COLOR_2_HEX = '#BEE3F8'

export const BASE_COLOR = (type: number) => {
	return `blue.${type}`
}

export const BOX_BORDER_COLOR = (type: number) => {
	return `gray.${type}`
}

export const BOX_BORDER_COLOR_LIGHT = BOX_BORDER_COLOR(200)
export const BOX_BORDER_COLOR_DARK = BOX_BORDER_COLOR(700)
