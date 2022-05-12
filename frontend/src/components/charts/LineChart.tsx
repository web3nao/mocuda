import { Line } from 'react-chartjs-2'
import {
	PRIMARY_COLOR_1_HEX,
	PRIMARY_COLOR_2_HEX,
} from '../../constants/style.const'

export interface LineChartOptions {
	legend: boolean
	title?: string
	data: {
		datasets: Array<{
			label: string
			values: Array<{ label: string; value: number }>
		}>
	}
}

export default function LineChart(lineChartOptions: LineChartOptions) {
	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: lineChartOptions.legend,
				position: 'top' as const,
			},
			title: {
				display: lineChartOptions.title ? true : false,
				text: lineChartOptions.title,
			},
			filler: {
				propagate: true,
			},
		},
		cubicInterpolationMode: 'monotone',
		scales: {
			x: {
				ticks: {
					display: false,
				},
				display: false,
			},
			y: {
				display: true,
			},
		},
		interaction: {
			intersect: false,
		},
	}

	const data = {
		labels: lineChartOptions.data.datasets[0].values.map(
			(datasetValue) => datasetValue.label,
		),
		datasets: lineChartOptions.data.datasets.map((dataset) => {
			return {
				label: dataset.label,
				data: dataset.values.map((datasetValue) => datasetValue.value),
				borderColor: PRIMARY_COLOR_1_HEX,
				backgroundColor: `${PRIMARY_COLOR_2_HEX}50`,
				fill: 'origin',
			}
		}),
	}
	return <Line options={options} data={data} />
}
