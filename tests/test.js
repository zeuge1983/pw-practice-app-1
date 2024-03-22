const checkForText = async (url, text) => {
  const response = await fetch(url);
  const body = await response.text();

  if (body.includes(text)) {
      console.log(`Passed. "${text}" found on ${url}`);
  } else {
      console.error(`Failed. Did not find "${text}" on ${url}!`);
  }
}

checkForText('https://www.komoot.com/team', 'Quality');
