import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const url = "https://fairytalez.com/the-buried-moon/";

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  const bookData = await page.evaluate((url) => {
    const bookPods = Array.from(document.querySelectorAll("article"));

    const data = bookPods.map((book) => ({
      title: book.querySelector("header h1").innerText,
      content: Array.from(book.querySelectorAll(".entry p")).map(
        (para) => para.innerText
      ),
      img: book.querySelector("img").getAttribute("src"),
    }));
    return data;
  }, url);
  console.log(bookData);
  await browser.close();
  fs.writeFileSync("works.json", JSON.stringify(bookData));
};

main();

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
