import express from 'express';
const router = express.Router();

router.get("/news", (req, res) => {
  res.json([
    {
      id: 1,
      upvotes: 130,
      title: "Fianto Duri, the complete tutorial",
      author: "RubeusH",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 2,
      upvotes: 126,
      title: "Ordinary Wizarding Levels study guide",
      author: "BathBabb",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 3,
      upvotes: 114,
      title: "Is muggle-baiting ever acceptable?",
      author: "Falco",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 4,
      upvotes: 97,
      title: "Untransfiguration classes to become compulsory at Hogwarts",
      author: "Baddock",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 5,
      upvotes: 85,
      title: "Cracking the Aurologist Interview ",
      author: "Hetty",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 6,
      upvotes: 74,
      title: "Conserving waterplants cheatsheet.",
      author: "Otto",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 7,
      upvotes: 66,
      title: "The Pragmatic Dragon Feeder",
      author: "Baruffio",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 8,
      upvotes: 50,
      title: "The complete quidditch statistics",
      author: "Hbeery",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 9,
      upvotes: 34,
      title: "Cracking the Aurologist Interview ",
      author: "Marcusb",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 10,
      upvotes: 29,
      title: "Could wizards prevent WW3?",
      author: "Cuthbert",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 11,
      upvotes: 20,
      title: "ASK WN: What do you use to digitalize your scrolls?",
      author: "Alphard",
      date: new Date("2017-04-14T15:30:00.000Z")
    },
    {
      id: 12,
      upvotes: 16,
      title: "Show WN: Wand-Extinguishing Protection",
      author: "Humphrey22",
      date: new Date("2017-04-14T15:30:00.000Z")
    }
  ]);
});

export default router;
