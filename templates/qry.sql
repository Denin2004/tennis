CREATE OR REPLACE FUNCTION stage_group.games(IN prm_stage_id integer)
  RETURNS TABLE(stage_id integer, group_id integer, game_id integer, score1 integer, score2 integer, tie1 integer, tie2 integer, 
group_competitor1_id integer, competitor1_score integer, competitor1_games_played integer, competitor1_id integer, player11 character varying, 
player12 character varying, group_competitor2_id integer, competitor2_score integer, competitor2_games_played integer, competitor2_id integer, player21 character varying, player22 character varying) AS
$BODY$
select groups.stage_id,
  groups.id as group_id,
  games.id as game_id, 
    games.score1, 
    games.score2, 
    games.tie1, 
    games.tie2,
  games.competitor1_id as group_competitor1_id,
    group_competitor1.score as competitor1_score, 
    group_competitor1.games_played as competitor1_games_played,
    group_competitor1.competitor_id as competitor1_id,
    player11.name player11, 
    player12.name player12,
  games.competitor2_id as group_competitor2_id, 
    group_competitor2.score as competitor2_score, 
    group_competitor2.games_played as competitor2_games_played,
    group_competitor2.competitor_id as competitor2_id,
    player21.name player21, 
    player22.name player22
from stage_group.groups groups
left join stage_group.games games on(games.group_id=groups.id)
left join stage_group.competitors group_competitor1 on(group_competitor1.id=games.competitor1_id)
left join competitions.competitors competitor1 on(competitor1.id=group_competitor1.competitor_id)
left join players.players player11 on(player11.id=competitor1.player1_id)
left join players.players player12 on(player12.id=competitor1.player2_id)
left join stage_group.competitors group_competitor2 on(group_competitor2.id=games.competitor2_id)
left join competitions.competitors competitor2 on(competitor2.id=group_competitor2.competitor_id)
left join players.players player21 on(player21.id=competitor2.player1_id)
left join players.players player22 on(player22.id=competitor2.player2_id)
where groups.stage_id=prm_stage_id
order by groups.id, player11.name;
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION stage_group.games(integer)
  OWNER TO postgres;
