const express = require("express");
const server = express();

const fs = require("fs");

const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT || 4000;

server.use(express.json());
server.use(cors());
server.use(express.static('dist'));
const quotes = JSON.parse(fs.readFileSync("./quotes/quotes.json", "utf8"));

const endpoints = [
  {
    route: "/api/quotes",
    description: "Get all quotes.",
  },
  {
    route: "/api/quotes/random",
    description: "Get a random quote.",
  },
  {
    route: "/api/quotes/author/:author",
    description: "Get quotes by a specific author.",
  },
  {
    route: "/api/quotes/lang",
    description:
      "Get quotes by language, available languages are 'en' and 'fr'.",
    example: "/api/quotes?lang=fr",
  },
];

// Helper function to get quote by language
const getQuoteByLanguage = (quoteObj, lang) => {
  return {
    id: quoteObj.id,
    quote: quoteObj.quote[lang],
    author: quoteObj.author,
    category: quoteObj.category,
    tags: quoteObj.tags,
    rating: quoteObj.rating,
    image_url: quoteObj.image_url,
    author_info: {
      bio: quoteObj.author_info.bio[lang],
      wiki_url: quoteObj.author_info.wiki_url,
    },
  };
};

function authorization(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === "qwerty") {
    return next();
  } else {
     return res.status(401).json({ message: "Not Authorized" });
  }
}

//Route to save new quote 
server.post('/new_quote', authorization, (req, res) => {
  console.log(req.body);
  res.json('data saved');
})

// Basic route
server.get("/", (req, res) => {
  res.status(200).json("Welcome to the Multilingual Quote Generator API!");
});

// Endpoint to return the list of endpoints
server.get("/api", (req, res) => {
  res.status(200).json({
    message:
      "Welcome to the Quote Generator API! Here are the available endpoints:",
    endpoints: endpoints,
  });
});

// Endpoint to return the list of all Quotes
server.get("/api/quotes", (req, res) => {
  const lang = req.query.lang || "en";
  const tag = req.query.tag;
  const langs = ["en", "fr"];

  if (!lang) {
    return res.status(200).json(quotes)
  }

  if(!tag) {
    return res.status(200).json(quotes)
  }

  if (tag) {
    const filteredQuotes = quotes.filter((q) =>
      q.tags.includes(tag.toLowerCase())
    );

    if (filteredQuotes.length > 0) {
      return res.status(200).json(filteredQuotes);
    } else {
      return res.status(404).json({
        error: "Tag not found",
      });
    }
  }

  if (langs.includes(lang.toLocaleLowerCase())) {
    return res.status(200).json(quotes.map((q) => getQuoteByLanguage(q, lang)));
  } else {
    return res.status(404).json({
      error: "No supported language found !",
    });
  }

});


// Endpoint to return quotes by author
server.get("/api/quotes/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase(); // Convert author parameter to lowercase for case-insensitive comparison

  // Check if author parameter is missing or invalid
  if (!author) {
    return res.status(400).json({
      error: "Missing or invalid parameter",
      message: "Please provide a valid author name.",
    });
  }

  // Filter quotes by author
  const filteredQuotes = quotes.filter(
    (quote) => quote.author.toLowerCase() === author
  );

  // Check if quotes by the author are found
  if (filteredQuotes.length > 0) {
    return res.json(filteredQuotes);
  } else {
    return res.status(404).json({
      error: "Author not found",
      message: `No quotes found for author '${req.params.author}'.`,
    });
  }
});

// Endpoint to return random quotes

server.get("/api/quotes/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);

  res.status(200).json(quotes[randomIndex]);
});

// Endpoint to return single quote by ID
server.get("/api/quote/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const singleQuote = quotes.find((q) => q.id === id);

  if (!singleQuote) {
    return res.status(404).json({
      message: "Quote not found",
      error: "Not found",
    });
  } else {
    return res.status(200).json(singleQuote);
  }
});

//Endpoint to return quotes by category
server.get("/api/quotes/category", (req, res) => {
  const query = req.query.c;
  // console.log(query)

  if (!query) {
    return res.status(400).json({
      error: "Missing or invalid query parameter",
      message: "Please provide a valid quote category",
      endpoints: endpoints,
    });
  }

  const queriedQuotes = quotes.filter(
    (q) => q.category.toLowerCase() === query.toLowerCase()
  );

  if (queriedQuotes.length > 0) {
    return res.json(queriedQuotes);
  } else {
    return res.status(404).json({
      error: "Category not found",
    });
  }
});

// 404 route handler
server.get("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message:
      "The requested endpoint doesn't exist. Please check the URL and try again.",
    availableEndpoints: endpoints,
  });
});

server.listen(port, () => {
  console.log(`Listening on Port: ${port}`);
});
