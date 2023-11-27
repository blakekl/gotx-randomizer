import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { observer } from "mobx-react-lite";
import { ChartType, LabeledStat } from '../../models/game';
import { useMemo, useState } from 'react';
import classNames from 'classnames';

interface ChartProps {
    data: LabeledStat[],
    title: string,
    name: string,
    chartType: ChartType
  }  

const Bar = observer(({ data, title, name, chartType}: ChartProps) => {
    const possiblePageSizes = [10, 20, 30, 40, 50, 100]
    const [pageSize, setPageSize] = useState(possiblePageSizes[0]);
    const [currentPage, setCurrentPage] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const dataStart = useMemo(() => currentPage * pageSize, [currentPage, pageSize]);
    const dataEnd = useMemo(() => dataStart + pageSize, [dataStart, pageSize]);
    const lastPage = data.length % pageSize === 0 ? Math.floor(data.length / pageSize) - 1 : Math.floor(data.length / pageSize);
    const chartOptions = useMemo(() => ({
        title: {
            text: title,
        },
        series: [
            {
                name: name,
                type: chartType,
                data: data.map(x => x.value)
                .slice(dataStart, dataEnd),
            }
        ],
        xAxis: {
            categories: data.map(x => x.label)
            .slice(dataStart, dataEnd),
        },
        legend: {
            enabled: false,
        }
    }), [data, chartType, title, name, dataStart, dataEnd]);
    
    const pageSizeDropdown = possiblePageSizes
        .map((value, index) => <a onClick={() => setPageSize(value)} className="dropdown-item" key={index}>{value}</a>);
        
    const allPages = [0, currentPage - 1, currentPage, currentPage + 1, lastPage].filter(x => x >= 0).filter(x => x <= lastPage);
    const includeFirstEllips = new Set(allPages.slice(0, 2)).size !== 1;
    const includeLastEllips = new Set(allPages. slice(-2, Number.MAX_SAFE_INTEGER)).size !== 1;
    const pages = Array.from(new Set(allPages))
        .map((value, index) => <li key={index}><a className={classNames({'pagination-link': true, 'is-current': value === currentPage})} onClick={() => setCurrentPage(value)}>{value + 1}</a></li>);
    if(includeFirstEllips) {
        pages.splice(1,0, <li key={-1}><span className='pagination-ellipsis'>&hellip;</span></li>);
    }
    if (includeLastEllips) {
        pages.splice(-1, 0, <li key={-2}><span className='pagination-ellipsis'>&hellip;</span></li>);
    }
    
    return <>
        <div className='my-4'>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions} />
            { data.length > possiblePageSizes[0] && 
            <nav className="pagination is-right my-1" role="navigation" aria-label="pagination">
                <div className={classNames({'is-active': menuOpen, dropdown: true})}>
                    <div className="dropdown-trigger">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span>{pageSize}&nbsp;/&nbsp;page</span>
                            <span><i className="fas fa-angle-down" aria-hidden="true"></i></span>
                        </button>
                    </div>
                    <div className="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                            {[...pageSizeDropdown]}
                        </div>
                    </div>
                </div>
                {currentPage > 0 && <a className="pagination-previous" onClick={() => setCurrentPage(currentPage - 1)}>Previous</a> }
                { currentPage < lastPage && <a className="pagination-next" onClick={() => setCurrentPage(currentPage + 1)}>Next</a> }
                <ul className="pagination-list">
                    {[...pages]}
                </ul>
            </nav> }
            <hr/>
        </div>
    </>
});
export default Bar;