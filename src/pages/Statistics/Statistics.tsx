import { useStores } from '../../stores/useStores';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import classNames from 'classnames';
import Chart from './Chart';

enum Tabs {
    COMPLETIONS,
    NOMINATIONS,
    TIME_TO_BEAT,
}

const Statistics = observer(() => {
    const [selectedTab, setSelectedTab] = useState(Tabs.NOMINATIONS);
    const {randomizerStore} = useStores();
    const mostCompletedGames = randomizerStore.getMostCompletedGames();
    const newestCompletedGames = randomizerStore.getNewestCompletions();
    const newestGotmCompletions = randomizerStore.getNewestGotmCompletions();
    const newestGotwotyCompletions = randomizerStore.getNewestGotwotyCompletions();
    const newestGotyCompletions = randomizerStore.getNewestGotyCompletions();
    const newestRetrobitCompletions = randomizerStore.getNewestRetrobitCompletions();
    const newestRpgCompletions = randomizerStore.getNewestRpgCompletions();
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
                <Chart data={mostCompletedGames} title='Most Completed Games' name='Completions' />
                <Chart data={newestGotmCompletions} title='Recent GotM Completions' name='Completions' />
                <Chart data={newestRpgCompletions} title='Recent RPG Completions' name='Completions' />
                <Chart data={newestGotwotyCompletions} title='Recent GotWotY Completions' name='Completions' />
            </div>
            <div className="column">
                <Chart data={newestCompletedGames} title='Recently Completed Games' name="Completions" />
                <Chart data={newestRetrobitCompletions} title='Recent Retrobit Completions' name="Completions" />
                <Chart data={newestGotyCompletions} title='Recent GotY Completions' name="Completions" />
            </div>
    </>
    const nominations = <>
            <div className="column">
                <Chart data={nominationsBeforeWin} title='Most Nominations Before Win' name='Nominations' />
                <Chart data={mostNominatedGames} title='Most Nominated Games' name='Nominations' />
                <Chart data={mostNominatedLosers} title='Most Nominated Games Without a Win' name='Nominations' />
            </div>
            <div className="column">
                <Chart data={mostNominatedGamesByUser} title='Most Nominations by User' name='Nominations' />
                <Chart data={topNominationWinsByUser} title='Most Winning Nominations by User' name='Wins' />
            </div>
    </>;
    const timeToBeat = <>
            <div className="column">
                <Chart data={longestMonthsByAvgTimeToBeat} title='Longest Months' name='Avg Time to Beat' />
                <Chart data={avgTimeToBeatByMonth} title='Average Time to Beat by Month' name='Hours' />
            </div>
            <div className="column">
                <Chart data={shortestMonthsByAvgTimeToBeat} title='Shortest Months' name='Avg Time to Beat' />
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