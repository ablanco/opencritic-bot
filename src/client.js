// Copyright (c) 2023 Alejandro Blanco <alejandro.b.e@gmail.com>
// MIT License

import axios from 'axios';
import Settings from './settings.js';

const baseOptions = {
    method: 'GET',
    url: 'https://opencritic-api.p.rapidapi.com/',
    headers: {
        'X-RapidAPI-Key': Settings.rapidAPIKey,
        'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com',
    },
};

const _renderGameData = function (gameDetails) {
    return `*${gameDetails.name}*
Tier: _${gameDetails.tier}_
Critics score: ${Math.round(gameDetails.topCriticScore)}
Number of critics reviews: ${gameDetails.numTopCriticReviews}
Median score: ${Math.round(gameDetails.medianScore)}
Number of reviews: ${gameDetails.numReviews}

[Open in OpenCritic](${gameDetails.url})`;
};

const details = async function (gameId) {
    const options = { ...baseOptions };
    options.url += `game/${gameId}`;

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

const search = async function (query) {
    const options = { ...baseOptions };
    options.url += 'game/search';
    options.params = { criteria: query };

    try {
        const response = await axios.request(options);
        const searchResults = response.data.slice(0, 3);

        const detailsPromises = searchResults.map((game) => {
            return details(game.id);
        });

        return Promise.all(detailsPromises)
            .then((gameDetailsList) => {
                return searchResults.map((game) => {
                    let gameDetails;

                    gameDetailsList.forEach((gameData) => {
                        if (gameData.id === game.id) {
                            gameDetails = gameData;
                        }
                    });

                    let thumbURL;
                    if (gameDetails.images.box) {
                        thumbURL =
                            'https://img.opencritic.com/' +
                            gameDetails.images.box.sm;
                    } else if (
                        gameDetails.images.screenshots &&
                        gameDetails.images.screenshots.length > 0
                    ) {
                        thumbURL =
                            'https://img.opencritic.com/' +
                            gameDetails.images.screenshots[0].sm;
                    }

                    return {
                        id: game.id,
                        type: 'article',
                        title: game.name,
                        description: gameDetails.description.slice(0, 100),
                        thumb_url: thumbURL,
                        input_message_content: {
                            message_text: _renderGameData(gameDetails),
                            parse_mode: 'Markdown',
                            disable_web_page_preview: false,
                        },
                    };
                });
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    }
};

export { search, details };
