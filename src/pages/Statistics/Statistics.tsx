import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useStores } from '../../stores/useStores';
import { observer } from 'mobx-react-lite';
import { LabeledStat } from '../../models/game';
import { useState } from 'react';
import classNames from 'classnames';

enum Tabs {
    COMPLETIONS,
    NOMINATIONS,
    TIME_TO_BEAT,
}

const Statistics = observer(() => {
    const [selectedTab, setSelectedTab] = useState(Tabs.NOMINATIONS);
    const {randomizerStore} = useStores();
    const mostCompletedGames = randomizerStore.getMostCompletedGames()
    const nominationsBeforeWin = randomizerStore.getTotalNominationsBeforeWinByGame();
    const topNominationWinsByUser = randomizerStore.getTopNominationWinsByUser();
    const mostNominatedGames = randomizerStore.getMostNominatedGames();
    const mostNominatedLosers = randomizerStore.getMostNominatedLoserGames();
    const avgTimeToBeatByMonth = randomizerStore.getAvgTimeToBeatByMonth().map(x => ({label: x.label, value: Number(x.value.toFixed(2))}));
    const longestMonthsByAvgTimeToBeat = randomizerStore.getLongestMonthsByAvgTimeToBeat();
    const shortestMonthsByAvgTimeToBeat = randomizerStore.getShortestMonthsByAvgTimeToBeat();
    const mostNominatedGamesByUser = randomizerStore.getMostNominatedGamesByUser();

    const generateBarChartOptions = (data: LabeledStat[], title: string, name: string): Highcharts.Options => {
        return  {
            title: {
                text: title,
            },
            series: [
                {
                    name: name,
                    type: 'bar',
                    data: data.map(x => x.value)
                        .slice(0, 20),
                }
            ],
            xAxis: {
                categories: data.map(x => x.label),
            },
            legend: {
                enabled: false,
            }
        }
    }

    const completions = <>
            <div className="column">
            <HighchartsReact
                    highcharts={Highcharts}
                    options={generateBarChartOptions(mostCompletedGames, 'Most Completed Games', 'Completions')} />
                <br/>
            </div>
            <div className="column"></div>
    </>
    const nominations = <>
            <div className="column">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={generateBarChartOptions(nominationsBeforeWin, 'Most Nominations Before Win', 'Nominations')} />
                <br/>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={generateBarChartOptions(mostNominatedGames, 'Most Nominated Games', 'Nominations')} />
                <br/>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={generateBarChartOptions(mostNominatedLosers, 'Most Nominated Games Without a Win', 'Nominations')} />
            </div>
            <div className="column">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={generateBarChartOptions(mostNominatedGamesByUser, 'Most Nominations by User', 'Nominations')} />
                <br/>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={generateBarChartOptions(topNominationWinsByUser, 'Most Winning Nominations By User', 'Wins')} />
            </div>
    </>;
    const timeToBeat = <>
            <div className="column">
            <HighchartsReact
                    highcharts={Highcharts}
                    options={generateBarChartOptions(longestMonthsByAvgTimeToBeat, 'Longest Months', 'Avg Time to Beat')} />
                <br/>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={generateBarChartOptions(avgTimeToBeatByMonth, 'Average Time to Beat by Month', 'Hours')} />
            </div>
            <div className="column">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={generateBarChartOptions(shortestMonthsByAvgTimeToBeat, 'Shortest Months', 'Avg Time to Beat')} />
            </div>
    </>;

    const tabsToHtmlMap = new Map([
        [Tabs.COMPLETIONS, completions],
        [Tabs.NOMINATIONS, nominations],
        [Tabs.TIME_TO_BEAT, timeToBeat],
    ])

    return <>
        <h1 className="title has-text-centered">Statistics</h1>
        <div className="tabs">
            <ul>
                <li className={classNames({'is-active': selectedTab === Tabs.NOMINATIONS})}><a onClick={() => setSelectedTab(Tabs.NOMINATIONS)}>Nominations</a></li>
                <li className={classNames({'is-active': selectedTab === Tabs.COMPLETIONS})}><a className='link' onClick={() => setSelectedTab(Tabs.COMPLETIONS)}>Completions</a></li>
                <li className={classNames({'is-active': selectedTab === Tabs.TIME_TO_BEAT})}><a onClick={() => setSelectedTab(Tabs.TIME_TO_BEAT)}>Time to Beat</a></li>
            </ul>
        </div>
        <div className="columns">
            {tabsToHtmlMap.get(selectedTab)}
        </div>
    </>
})

export default Statistics;