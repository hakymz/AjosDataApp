import React from 'react';
import {
  Chart,
  Line,
  Area,
  VerticalAxis,
  HorizontalAxis,
  Tooltip,
} from 'react-native-responsive-linechart';
import {COLORS, FONTS} from '../../../conts';
import {formatAmount} from '../../../helper';
export const CustomChart = ({dataList, priceChange, style, label = false}) => {
  const oneHourInMilSec = 3600 * 1000;
  const oneDayInMillSec = oneHourInMilSec * 24;
  const sevenDaysInMilSec = oneDayInMillSec * 7;
  const startingSpikeTime = new Date().getTime() - sevenDaysInMilSec;

  const chartData = dataList?.map((item, index) => {
    return {
      x: parseInt(startingSpikeTime + (index + 1) * oneHourInMilSec),
      y: item * 1,
    };
  });

  if (!dataList) {
    return null;
  }

  return (
    dataList && (
      <Chart style={{...style}} data={chartData} padding={{}}>
        <Line
          tooltipComponent={
            label && (
              <Tooltip
                theme={{
                  label: {color: COLORS.black},
                  shape: {color: COLORS.white, width: 40, height: 25},
                  formatter: value => formatAmount(value.y),
                }}
              />
            )
          }
          theme={{
            stroke: {color: priceChange < 0 ? '#E50F01' : '#34A853', width: 1},
          }}
        />
        {label && (
          <VerticalAxis
            tickCount={5}
            theme={{
              labels: {
                formatter: v => formatAmount(v),
                visible: true,
                label: {
                  color: COLORS.white,
                  fontSize: 8,
                  fontFamily: FONTS.regular,
                },
              },
              axis: {
                visible: false,
              },
              ticks: {
                visible: false,
              },
              grid: {visible: false},
            }}
          />
        )}

        <Area
          theme={{
            gradient: {
              from: {
                color: priceChange < 0 ? '#E50F01' : '#34A853',
                opacity: 0.2,
              },
              to: {
                color: priceChange < 0 ? '#E50F01' : '#34A853',
                opacity: 0,
              },
            },
          }}
        />

        {label && (
          <HorizontalAxis
            tickCount={5}
            theme={{
              labels: {
                formatter: date => {
                  const newDate = new Date(date);
                  const formatterDate = `${newDate.getDate()}/${
                    newDate.getMonth() + 1
                  }/${newDate.getFullYear() + 1} `;

                  return formatterDate;
                },

                visible: true,
                label: {
                  color: COLORS.white,
                  fontSize: 8,
                  fontFamily: FONTS.regular,
                  textAnchor: 'end',
                },
              },
              axis: {
                visible: true,
              },
              ticks: {
                visible: false,
              },
              grid: {visible: false},
            }}
          />
        )}
      </Chart>
    )
  );
};
