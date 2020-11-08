### Hasty-tasty-bot

DISCLAIMER: This is the source code for our Proof of Concept.

To use this repo you need the hasty-tasty flask api: https://github.com/tterimaa/hasty-tasty-bot-api

The Problem
==========

Life is hard and short. Who has the energy or time to open a separate app just to decide where to eat together with our friends? Not us, and probably not you either. But what if we could do it all inside a Telegram chat group we already use to communicate with them? Now, wouldn’t that be convenient.

__/HastyTastyBot__ is a Telegram Bot to help groups of friends decide where to eat together. It enables members of a group chat to specify their individual dining preferences, provides tailored restaurant recommendations based on those preferences, and facilitates member voting until a crowd-pleasing option is found — all without leaving __Telegram__!

How It Works
==========

At the heart of the service is a database hosted by __Aito.ai__ of restaurants, user profiles, and their past ratings of those restaurants. To maximize the happiness of the group, /HastyTastyBot estimates, for each individual, the probability of being happy with each restaurant option. It uses Bayesian inference to take everyone’s dining preferences into account. It then suggests the option that maximizes the expected probability of the group members being happy with the results. 

Another nice feature is that the bot filters results by accepted payment methods, to make sure nobody in the group will run into problems when the bill arrives. (Remember, not every country fancies card-payment as much as Finland does). 

Outlook
=======

The demo we provide gives you an idea about the basic functionalities that are possible, which we have produced within the time constraints of this hackathon. Our sandbox data is limited mostly to restaurants from a city in Mexico. More sophisticated versions of the bot in future could provide recommendations for other cities, check for the availability of parking lots or take the opening hours into account. The bot's underlying system allows for easy modifications.  

To fully leverage the predictive power of Aito.ai,  the bot could collect feedback from the users for the suggested restaurant to populate its database. With a growing database, the bot could even learn the preferences of individual users over time –  __Machine Learning__ powered by Aito.ai makes it possible! 
