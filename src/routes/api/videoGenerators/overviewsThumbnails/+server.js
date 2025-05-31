import { ImageVideoElement } from '$lib/classes/video/imageVideoElement.js';
import { PaddingElement } from '$lib/classes/video/paddingHolder.js';
import { TextVideoElement } from '$lib/classes/video/textVideoElement.js';
import { renderTemplate } from '$lib/scripts/videoTemplateGenerator.js';

export async function POST({ request }) {
	const data = await request.json();

	const outputDimensions = { w: 1080, h: 1920 };
	const padding = new PaddingElement({ x: 150, y: 500 });

	const response = await renderTemplate({
		onlyFrame: data.testFrame,
		duration: 'thumbnail',
		padding: padding,
		overviewPoster: true,
		videoElements: videoElements({
			label: data.label,
			outputDimensions: outputDimensions,
			padding: padding
		})
	});

	return new Response(
		JSON.stringify(
			{
				output: response,
				format: data.testFrame ? 'html' : 'image'
			},
			{ status: 200 }
		)
	);
}

const videoElements = ({ label, outputDimensions, padding }) => {
	const logoSize = (outputDimensions.h - padding.getY()) * 0.6;
	return [
		new ImageVideoElement({
			id: 'zz-logo',
			content: './vidGenAssets/logo_transparent.png',
			posX: (outputDimensions.w - logoSize) / 2,
			posY: (outputDimensions.h - logoSize) / 2,
			wPx: logoSize,
			hPx: logoSize
		}),
		new TextVideoElement({
			id: 'poster-label',
			content: `Program na ${label}`,
			posY: 0,
			fontName: 'Neue Machina Regular',
			fontSizePx: 90,
			fontColor: '#d4d4d4',
			textAlign: 'center'
		}),
		new TextVideoElement({
			id: 'poster-program-link',
			content: `Detailněji na program.zizkarna.cz`,
			posY: outputDimensions.h - padding.getY() - 145,
			fontName: 'Karla Regular',
			fontSizePx: 70,
			lineHeight: 1,
			fontColor: '#d4d4d4',
			textAlign: 'center'
		})
	];
};
