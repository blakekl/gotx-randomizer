import { runInAction } from 'mobx';
import dbClient from '../data';
import { Game, LabeledStat } from '../models/game';

interface GameCollection {
  gotmRunnerUp: Game[];
  gotmWinners: Game[];
  retrobits: Game[];
  rpgRunnerUp: Game[];
  rpgWinners: Game[];
}

class DbStore {
  allGames: GameCollection = {
    gotmRunnerUp: [],
    gotmWinners: [],
    retrobits: [],
    rpgRunnerUp: [],
    rpgWinners: [],
  } as GameCollection;

  emptyGame = {
    id: 0,
    title_usa: '',
    year: 0,
    system: '',
    developer: '',
    genre: '',
    img_url: '',
    time_to_beat: 0,
    screenscraper_id: 0,
    created_at: '',
    updated_at: '',
  } as Game;  

  constructor() {
    const gotmRunnerUp = dbClient.getGotmRunnerup() || [];
    const gotmWinners = dbClient.getGotmWinners() || [];
    const retrobits = dbClient.getRetrobits() || [];
    const rpgRunnerUp = dbClient.getRpgRunnerup() || [];
    const rpgWinners = dbClient.getRpgWinners() || [];
    runInAction(() => {
      this.setAllGames({
        gotmRunnerUp,
        gotmWinners,
        retrobits,
        rpgRunnerUp,
        rpgWinners,
      });
    });
  }    

  setAllGames(value: GameCollection) {
    this.allGames = value;
  }

  getMostCompletedGames(): LabeledStat[] {
    return dbClient.mostCompletedGames() ?? [];
  }

  getMostCompletedGotmGames(): LabeledStat[] {
    return dbClient.mostCompletedGotmGames() ?? [];
  }

  getMostCompletedGotyGames(): LabeledStat[] {
    return dbClient.mostCompletedGotyGames() ?? [];
  }

  getMostCompletedRetrobitGames(): LabeledStat[] {
    return dbClient.mostCompletedRetrobitGames() ?? [];
  }

  getMostCompletedRetrobitYearGames(): LabeledStat[] {
    return dbClient.mostCompletedRetrobitYearGames() ?? [];
  }

  getMostCompletedRpgGames(): LabeledStat[] {
    return dbClient.mostCompletedRpgGames() ?? [];
  }

  getNewestCompletions(): LabeledStat[] {
    return dbClient.newestCompletions() ?? [];
  }
 
  getNewestGotmCompletions(): LabeledStat[] {
    return dbClient.newestGotmCompletions() ?? [];
  }
 
  getNewestGotwotyCompletions(): LabeledStat[] {
    return dbClient.newestGotwotyCompletions() ?? [];
  }
 
  getNewestGotyCompletions(): LabeledStat[] {
    return dbClient.newestGotyCompletions() ?? [];
  }
 
  getNewestRetrobitCompletions(): LabeledStat[] {
    return dbClient.newestRetrobitCompletions() ?? [];
  }
 
  getNewestRpgCompletions(): LabeledStat[] {
    return dbClient.newestRpgCompletions() ?? [];
  }
 
  getTotalNominationsBeforeWinByGame(): LabeledStat[] {
    return dbClient.totalNomsBeforeWinByGame() ?? [];
  }

  getTopNominationWinsByUser(): LabeledStat[] {
    return dbClient.topNominationWinsByUser() ?? [];
  }

  getMostNominatedGames(): LabeledStat[] {
    return dbClient.mostNominatedGames() ?? [];
  }

  getMostNominatedLoserGames(): LabeledStat[] {
    return dbClient.mostNominatedLoserGames() ?? [];
  }

  getAvgTimeToBeatByMonth(): LabeledStat[] {
    return dbClient.avgTimeToBeatByMonth() ?? [];
  }

  getTotalTimeToBeatByMonth(): LabeledStat[] {
    return dbClient.totalTimeToBeatByMonth() ?? [];
  }

  getLongestMonthsByAvgTimeToBeat(): LabeledStat[] {
    return dbClient.longestMonthsByAvgTimeToBeat() ?? [];
  }

  getShortestMonthsByAvgTimeToBeat(): LabeledStat[] {
    return dbClient.shortestMonthsByAvgTimeToBeat() ?? [];
  }

  getMostNominatedGamesByUser(): LabeledStat[] {
    return dbClient.mostNominatedGamesByUser() ?? [];
  }

  getNominationSuccessPercentByUser(): LabeledStat[] {
    return dbClient.getNominationSuccessPercentByUser() ?? [];
  } 

  getNominations(id: number) {
    return dbClient.getNominationData(id);
  }
}

export default DbStore;