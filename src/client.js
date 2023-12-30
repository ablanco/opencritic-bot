// Copyright (c) 2023 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import axios from 'axios';
import Settings from './settings.js';

const options = {
    method: 'GET',
    url: 'https://opencritic-api.p.rapidapi.com/game/search',
    params: {
        criteria: 'the withcer 3',
    },
    headers: {
        'X-RapidAPI-Key': Settings.rapidAPIKey,
        'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com',
    },
};

const search = async function () {
    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

export { search };
