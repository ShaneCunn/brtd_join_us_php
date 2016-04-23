var soeCensusApi = function(){
	this.init = function(){
		// outfit_id=37509488620602547&
		var url = "http://census.daybreakgames.com/get/ps2:v2/outfit/?outfit_id=37509488620602547&c:resolve=member_characters_stat_history(stat_name,all_time),member_character(name,battle_rank,characters_stat_history),member_online_status";
		var that = this;
		$.get(url, function(data){
			if(typeof(data) === "object"){
				that.calculateStats(data.outfit_list[0]);
			}
		}, "jsonp");
	}

	this.calculateStats = function(outfit){
		outfit.stats_history = new Object();
		outfit.memcount = 0;
		outfit.onlinecount = 0;
		// Loop through the members
		for(i in outfit.members){
			var m = outfit.members[i];

			// Loop through the stats
			if(typeof(m.character) === "object"){
				outfit.memcount++;

				if(m.online_status == "10"){
					outfit.onlinecount++;
				}

				for(n in m.character.stats.stat_history){
					var s = m.character.stats.stat_history[n];

					var oldval = parseInt(outfit.stats_history[s.stat_name]);
					if(isNaN(oldval)){
						oldval = 0;
					}
					var newval = (parseInt(s.all_time) || 0);

					outfit.stats_history[s.stat_name] = parseInt(oldval + newval);
				}
			}

		}

		outfit.stats_history.avg_br = outfit.stats_history.battle_rank / outfit.memcount;

		this.fillOutfitStats(outfit);
	}

	this.fillOutfitStats = function(outfit){

		$(".census_avg_br").attr("data-target_num", outfit.stats_history.avg_br);
		$(".census_memcount").attr("data-target_num", outfit.members.length);
		$(".census_kills").attr("data-target_num", outfit.stats_history.kills);
		$(".census_deaths").attr("data-target_num", outfit.stats_history.deaths);
		$(".census_kd").attr("data-target_num", outfit.stats_history.kills / outfit.stats_history.deaths);
		$(".census_onlinecount").attr("data-target_num", outfit.onlinecount);

		if( outfit.stats_history.kills > outfit.stats_history.deaths){
			$(".census_deaths_width").attr("data-target_num", outfit.stats_history.deaths / outfit.stats_history.kills * 100);
			$(".census_kills_width").attr("data-target_num", 100);

		}

		var random_member = outfit.members[Math.floor(Math.random()*outfit.members.length)];
		$(".census_name a").text(random_member.name.first).attr("href", "https://www.planetside2.com/players/"+random_member.character_id);

		var lh_functions = new lhFunctions();
		lh_functions.animate_numbers();
	}
}