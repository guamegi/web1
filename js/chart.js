function draw_chart(data) {
    var str_data = JSON.stringify(data);
    console.log("data="+str_data);

    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [];

    // ohlc 데이터 삽입
    ohlc.push([
        // data[i][17], // the date
        // data[i][2], // open
        // data[i][3], // high
        // data[i][4], // low
        // data[i][6] // close
        data.trade_date,
        data.opening_price,
        data.high_price,
        data.low_price,
        data.trade_price
    ]);
    // 거래량 데이터 삽입
    volume.push([
        data.trade_date,
        data.trade_volume
    ]);

    
    Highcharts.stockChart('container', {
        yAxis: [{
            labels: {
                align: 'left'
            },
            height: '80%',
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'left'
            },
            top: '80%',
            height: '20%',
            offset: 0
        }],
        tooltip: {
            shape: 'square',
            headerShape: 'callout',
            borderWidth: 0,
            shadow: true,
            positioner: function (width, height, point) {
                var chart = this.chart,
                    position;

                if (point.isHeader) {
                    position = {
                        x: Math.max(
                            // Left side limit
                            chart.plotLeft,
                            Math.min(
                                point.plotX + chart.plotLeft - width / 2,
                                // Right side limit
                                chart.chartWidth - width - chart.marginRight
                            )
                        ),
                        y: point.plotY
                    };
                } else {
                    position = {
                        x: point.series.chart.plotLeft,
                        y: point.series.yAxis.top - chart.plotTop
                    };
                }

                return position;
            }
        },
        plotOptions: {
            candlestick: {
                downColor: 'blue',
                upColor: 'red'
            }
        },
        series: [{
            // type: 'ohlc',
            type: 'candlestick',
            id: 'BTC-ohlc',
            name: 'BTC Price',
            data: ohlc
        }, {
            type: 'column',
            id: 'BTC-volume',
            name: 'BTC Volume',
            data: volume,
            yAxis: 1
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 800
                },
                chartOptions: {
                    rangeSelector: {
                        inputEnabled: false
                    }
                }
            }]
        }
    });
};
