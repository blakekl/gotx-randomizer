import { useStores } from '../../stores/useStores';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import classNames from 'classnames';
import { ChartType } from '../../models/game';
import Bar from './Bar';

enum Tabs {
    COMPLETIONS,
    NOMINATIONS,
    TIME_TO_BEAT,
}

const Statistics = observer(() => {
    const [selectedTab, setSelectedTab] = useState(Tabs.NOMINATIONS);
    const {randomizerStore} = useStores();
    const mostCompletedGames = randomizerStore.getMostCompletedGames();
    const newestCompletedGames = randomizerStore.getNewestCompletedGames();
    const nominationsBeforeWin = randomizerStore.getTotalNominationsBeforeWinByGame();
    const topNominationWinsByUser = randomizerStore.getTopNominationWinsByUser();
    const mostNominatedGames = randomizerStore.getMostNominatedGames();
    const mostNominatedLosers = randomizerStore.getMostNominatedLoserGames();
    const avgTimeToBeatByMonth = randomizerStore.getAvgTimeToBeatByMonth().map(x => ({label: x.label, value: Number(x.value.toFixed(2))}));
    const longestMonthsByAvgTimeToBeat = randomizerStore.getLongestMonthsByAvgTimeToBeat();
    const shortestMonthsByAvgTimeToBeat = randomizerStore.getShortestMonthsByAvgTimeToBeat();
    const mostNominatedGamesByUser = randomizerStore.getMostNominatedGamesByUser();

    const completions = <>
            <div className="column">
                <Bar chartType={ChartType.BAR} data={mostCompletedGames} title='Most Completed Games' name='Completions' />
            </div>
            <div className="column">
                <Bar chartType={ChartType.BAR} data={newestCompletedGames} title='Newest Completed Games' name="Completions" />
            </div>
    </>
    const nominations = <>
            <div className="column">
                <Bar chartType={ChartType.BAR} data={nominationsBeforeWin} title='Most Nominations Before Win' name='Nominations' />
                <Bar chartType={ChartType.BAR} data={mostNominatedGames} title='Most Nominated Games' name='Nominations' />
                <Bar chartType={ChartType.BAR} data={mostNominatedLosers} title='Most Nominated Games Without a Win' name='Nominations' />
            </div>
            <div className="column">
                <Bar chartType={ChartType.BAR} data={mostNominatedGamesByUser} title='Most Nominations by User' name='Nominations' />
                <Bar chartType={ChartType.BAR} data={topNominationWinsByUser} title='Most Winning Nominations by User' name='Wins' />
            </div>
    </>;
    const timeToBeat = <>
            <div className="column">
                <Bar chartType={ChartType.BAR} data={longestMonthsByAvgTimeToBeat} title='Longest Months' name='Avg Time to Beat' />
                <Bar chartType={ChartType.BAR} data={avgTimeToBeatByMonth} title='Average Time to Beat by Month' name='Hours' />
            </div>
            <div className="column">
                <Bar chartType={ChartType.BAR} data={shortestMonthsByAvgTimeToBeat} title='Shortest Months' name='Avg Time to Beat' />
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