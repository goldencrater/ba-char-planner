<script setup>
import { ref } from 'vue'

const raid = ref('Binah');
const difficulty = ref('Extreme');

const bosses = ['Binah', 'Chesed', 'Hieronymus', 'Hod', 'Kaiten', 'Perorodzilla', 'Shirokuro'];
const difficulties = ['Normal', 'Hard', 'Very Hard', 'Hardcore', 'Extreme', 'Insane'];
const difficultyMultiplier = {
    'Normal': 400,
    'Hard': 800,
    'Very Hard': 1600,
    'Hardcore': 3200,
    'Extreme': 6400,
    'Insane': 12800
};
const difficultyScore = {
    'Normal': 250000,
    'Hard': 500000,
    'Very Hard': 1000000,
    'Hardcore': 2000000,
    'Extreme': 4000000,
    'Insane': 6800000,
};
const hpScore = {
    3: {
        'Normal': 373000,
        'Hard': 746000,
        'Very Hard': 1492000,
        'Hardcore': 2984000,
        'Extreme': 5968000,
        'Insane': 10145600,
    },
    4: {
        'Normal': 325000,
        'Hard': 650000,
        'Very Hard': 1300000,
        'Hardcore': 2600000,
        'Extreme': 5200000,
        'Insane': 8840000,
    },
}

const time = ref('0:00');
const score = ref();

function getDifficultyMultiplier()
{
    return difficultyMultiplier[difficulty.value];
}

function getBaseScore()
{
    let bossLength = 4;
    if(raid.value === 'Binah' || raid.value === 'Kaiten')
    {
        bossLength = 3;
    }
    return difficultyScore[difficulty.value] + hpScore[bossLength][difficulty.value];
}

function calculateScoreFromTime(eObj)
{
    if(!eObj.target.validity.valid)
    {
        time.value = time.value.substr(0, time.value.length - 1);
        return;
    }
    let maxLength = 0;
    let remainingTime = 0;
    if(raid.value === 'Binah' || raid.value === 'Kaiten')
    {
        maxLength = 720;
    }
    else
    {
        maxLength = 960;
    }
    let timeInSeconds = maxLength;
    let timeParts = time.value.split(':');
    if(timeParts.length === 1)
    {
        timeInSeconds = parseFloat(timeParts[0]);
    }
    else
    {
        timeInSeconds = parseInt(timeParts[0] * 60) + parseFloat(timeParts[1]);
    }
    remainingTime = maxLength - timeInSeconds;
    if(remainingTime < 0)
    {
        remainingTime = 0;
    }
    let difficultyMultiplier = getDifficultyMultiplier();
    let baseScore = getBaseScore();
    score.value = (baseScore + (difficultyMultiplier * remainingTime)).toLocaleString('en-GB');
}

function calculateTimeFromScore(eObj)
{
    if(!eObj.target.validity.valid)
    {
        score.value = score.value.substr(0, score.value.length - 1);
        return;
    }
    let maxLength = 0;
    if(raid.value === 'Binah' || raid.value === 'Kaiten')
    {
        maxLength = 720;
    }
    else
    {
        maxLength = 960;
    }
    let baseScore = getBaseScore();
    let difficultyMultiplier = getDifficultyMultiplier();
    let flatScore = score.value.replaceAll(',', '') - baseScore;
    let timeleft = maxLength - (flatScore / difficultyMultiplier);
    if(timeleft > maxLength)
    {
        timeleft = maxLength;
    }
    let mins = Math.floor(timeleft / 60);
    let secs = timeleft - (mins * 60);
    time.value = mins + ':' + (secs < 10 ? '0' + secs : secs);
}

function resetInputs()
{
    time.value = '0:00';
    score.value = '';
}


</script>

<template>
<div class="scorecalc container">
    <div class="row selectwrapper">
        <label for="raid">Raid Boss:</label>
        <select v-model="raid" class="form-control" id="raid" @change="resetInputs">
            <option :value="n" v-for="n in bosses" :key="n">{{n}}</option>
        </select>
    </div>
    <div class="row selectwrapper">
        <label for="difficulty">Difficulty:</label>
        <select v-model="difficulty" class="form-control" id="difficulty" @change="resetInputs">
            <option :value="n" v-for="n in difficulties" :key="n">{{n}}</option>
        </select>
    </div>
    <div class="row inputwrapper">
        <label for="time">Time</label>
        <input v-model="time" id="time" class="form-control" pattern="([0-9]{1,2}:[0-9]{0,2}(\.[0-9]*)?)|([0-9]+\.?[0-9]*)" @focus="$event.target.select()" @input="calculateScoreFromTime"/>
    </div>
    <div class="row inputwrapper">
        <label for="score">Score</label>
        <input v-model="score" id="score" class="form-control" pattern="([0-9]{1,3},?)*[0-9]{0,3}" @input="calculateTimeFromScore"/>
    </div>
</div>
</template>

<style>
.scorecalc
{
    border: 1px solid rgba(0,0,0, 0.125);
    border-radius: 0.25rem;
    padding-top: 10px;
}

.scorecalc .inputwrapper,
.scorecalc .selectwrapper
{
    padding-right: calc(var(--bs-gutter-x) * .5);
    padding-left: calc(var(--bs-gutter-x) * .5);
    padding-bottom: 10px;
}

</style>
