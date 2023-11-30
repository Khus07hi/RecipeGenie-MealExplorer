"use strict";

/**
 * Import
 */

import { fetchData } from "./api.js"
import { getTime } from "./module.js"

/**
 * Render data
 */

const $detailContainer = document.querySelector("[data-detail-container]");

ACCESS_POINT += `/${window.location.search.slice(window.location.search.indexOf("=") + 1)}`;

fetchData(null, data => {

    const {
        images: { LARGE, REGULAR, SMALL, THUMBNAIL },
        label: title,
        source: author,
        ingredients = [],
        totalTime: cookingTime = 0,
        calories = 0,
        cuisineType = [],
        dietLabels = [],
        dishType = [],
        yield: servings = 0,
        ingredientLines = [],
        uri,
        url: recipeUrl // Added recipe URL
    } = data.recipe;

    document.title = `${title}`;

    const banner = LARGE ?? REGULAR ?? SMALL ?? THUMBNAIL;
    const { url: bannerUrl, width, height } = banner;
    const tags = [...cuisineType, ...dietLabels, ...dishType];

    let tagElements = "";
    let ingredientItems = "";

    const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
    const isSaved = window.localStorage.getItem(`RecipeGenie-recipe${recipeId}`);

    tags.map(tag => {

        let type = "";

        if (cuisineType.includes(tag)) {
            type = "cuisineType";
        } else if (dietLabels.includes(tag)) {
            type = "diet"
        } else {
            type = "dishType";
        }

        tagElements += `
            <a href="./recipes.html?${type}=${tag.toLowerCase()}" class="filter-chip label-large
            has-state">${tag}</a>
        `;

    });

    ingredientLines.map(ingredient => {
        ingredientItems += `
            <li class="ingr-item">${ingredient}</li>    
            </li>
        `;
    });

    $detailContainer.innerHTML = `
        <figure class="detail-banner img-holder"> 
            <img src="${bannerUrl}" width="${width}" height="${height}" alt="${title}" 
            class="img-cover">   
        </figure>

        <div class="detail-content">

        <div class="title-wrapper"> 
            <h1 class="display-small">${title ?? "Untitled"}</h1>

            <button class="btn btn-secondary has-state has-icon ${
              isSaved ? "saved" : "removed"
            }" onclick="saveRecipe(this, '${recipeId}')">

                <span class="material-symbols-outlined bookmark-add" 
                aria-hidden="true">bookmark_add</span>

                <span class="material-symbols-outlined bookmark"
                aria-hidden="true">bookmark</span>

                <span class="label-large save-text">Save</span> 
                <span class="label-large unsaved-text">Unsave</span>

            </button>

            <a href="${recipeUrl}" class="btn btn-secondary has-state has-icon view-recipe" onclick="viewRecipe('${recipeUrl}')">
                <span class="material-symbols-outlined recipe-book" aria-hidden="true">book</span>
                <span class="label-large recipe-text">View Recipe</span>
            </a>


        </div>

        <div class="detail-author label-large"> 
            <span class="span">by</span> ${author}
        </div>

        <div class="detail-stats">

            <div class="stats-item"> 
                <span class="display-medium">${ingredients.length}</span>
                <span class="label-medium">Ingredients</span>
            </div>


            <div class="stats-item"> 
                <span class="display-medium">${
                  getTime(cookingTime).time || "<10"
                }</span>
                <span class="label-medium">${
                  getTime(cookingTime).timeUnit
                }</span>
            </div>


            <div class="stats-item"> 
                <span class="display-medium">${Math.floor(calories)}</span>
                <span class="label-medium">Calories</span>
            </div>
        </div>

        ${tagElements ? `<div class="tag-list">${tagElements}</div>` : ""}

        <h2 class="title-medium ingr-title">
            Ingredients
            <span class="label-medium">for ${servings} Servings</span> 
        </h2>
            
        ${
          ingredientItems
            ? `<ul class="body-large ingr-list">
        ${ingredientItems}</ul>`
            : ""
        }

        </div>
    `;
});
