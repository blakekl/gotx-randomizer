import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsExport from 'highcharts/modules/exporting';
import { observer } from 'mobx-react-lite';
import { SeriesType, LabeledStat } from '../../models/game';
import { useMemo, useState } from 'react';
import classNames from 'classnames';
import Pagination from '../../components/Pagination';

interface ChartProps {
  data: LabeledStat[];
  title: string;
  name: string;
}

const Chart = observer(({ data, title, name }: ChartProps) => {
  const [chartType, setChartType] = useState(SeriesType.BAR);
  const [chartMenuOpen, setChartMenuOpen] = useState(false);
  const [indexRange, setIndexRange] = useState([0, 0]);

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: chartType,
        styleMode: true,
      },
      title: {
        text: title,
      },
      series: [
        {
          name: name,
          data: data.map((x) => x.value).slice(indexRange[0], indexRange[1]),
        },
      ],
      xAxis: {
        categories: data
          .map((x) => x.label)
          .slice(indexRange[0], indexRange[1]),
      },
      legend: {
        enabled: false,
      },
    }),
    [data, chartType, title, name, indexRange],
  );

  highchartsExport(Highcharts);

  return (
    <>
      <div className="my-4">
        <div
          className={classNames({
            'is-active': chartMenuOpen,
            dropdown: true,
            'my-2': true,
          })}
        >
          <div className="dropdown-trigger">
            <button
              onBlur={() => setTimeout(() => setChartMenuOpen(false), 100)}
              onClick={() => setChartMenuOpen(!chartMenuOpen)}
              className="button"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
            >
              <span>Type: {chartType}</span>
              <span className="ml-2">
                <i className="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {[
                ...Object.entries(SeriesType).map(([value, index]) => (
                  <a
                    onClick={() =>
                      setChartType(value.toLowerCase() as SeriesType)
                    }
                    className="dropdown-item"
                    key={index}
                  >
                    {value.toLowerCase()}
                  </a>
                )),
              ]}
            </div>
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        <Pagination
          count={data.length}
          onPageChange={setIndexRange}
        ></Pagination>
        <hr />
      </div>
    </>
  );
});
export default Chart;
