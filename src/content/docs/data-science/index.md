---
title: "Data Science"
description: "Turning data into findings with Python: the library ecosystem, reproducible notebooks with pixi and marimo, and a research process built around testing a hypothesis."
ownership: frame-and-link
projects: [vpp, solar-map, thermal-camera]
coreFor: [solar-map]
owner: "@TBD"
lastReviewed: 2026-10-03
---

This section covers how we turn sensor readings, images, and public datasets into findings people can trust and act on.

Data science is research with code: you ask a question, gather data, and let the evidence answer it. We do this in Python, keep the work in notebooks so anyone can rerun and read it, and follow a process built around testing a hypothesis. For a free, in-depth introduction to the main Python tools, see Jake VanderPlas's [Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/).

## The Python ecosystem

Python's real strength for research is its libraries. People have spent decades building powerful, well-tested tools, and most research builds on the same few:

- **[NumPy](https://numpy.org/):** fast math on large arrays of numbers. Most other libraries are built on it.
- **[pandas](https://pandas.pydata.org/):** tables of data, like a spreadsheet you control with code: load, filter, group, and combine.
- **[Matplotlib](https://matplotlib.org/):** charts and plots.
- **[SciPy](https://scipy.org/):** statistics and scientific methods.

There are many more for specific jobs, like maps, images, and machine learning. Each one is a dependency, so the trust-and-responsibility balance from [The Computing Stack](/computing-stack/) applies here too.

## pixi: our project environment

We standardize on **[pixi](https://pixi.prefix.dev/)** to manage Python projects. pixi installs Python itself and every library a project needs, and records them in two files you'll recognize from [The Computing Stack](/computing-stack/):

- `pixi.toml`, the **manifest**: what the project asks for.
- `pixi.lock`, the **lockfile**: the exact versions that got installed.

Commit both, and anyone who clones the project can run `pixi install` and get the same environment, on Linux, macOS, or Windows. It's the same idea as mise pinning Node for this site, but for Python and all of its libraries together.

## Notebooks

A **notebook** keeps code, its results, charts, and written notes together in one document. That gives research two things:

- **Reproducibility:** anyone can rerun the notebook from the raw data and check that they get the same results.
- **Rich communication:** the reasoning, the code, and the charts sit side by side, so a reader can follow how you got from question to answer.

We use **[marimo](https://docs.marimo.io/)** for notebooks. **Jupyter Notebook** is another common option, and you'll see it in a lot of research and tutorials. We prefer marimo for two reasons:

- A marimo notebook is saved as a plain Python file, so it works well with Git and code review.
- It's **reactive**: when you change a cell, every cell that depends on it reruns automatically. Your results always match your code, and you never get confused by cells run out of order.

## The research process

![Five steps in a row inside a notebook: 1, hypothesis; 2, load data, often from an API; 3, clean and transform; 4, explore and visualize; 5, test by trying to disprove the hypothesis and reporting statistical confidence. An arrow loops from step 5 back to step 1: revise the hypothesis, or chase a sub-hypothesis you noticed along the way.](./research-loop.svg)

1. **Start with a hypothesis:** a specific claim the data could prove wrong. "Solar is better in summer" is vague. "An average July day gets more than twice the solar energy of an average January day" can be tested.
2. **Load the data.** We often load it straight from an **API** (see [The Computing Stack](/computing-stack/)), so the notebook records exactly where the data came from.
3. **Clean and transform.** Real data has gaps, errors, odd formats, and confusing column names. Fix them, and reshape the data into the form your question needs. This step often takes the most time.
4. **Explore and visualize.** Summarize and plot before testing anything. Charts show patterns, outliers, and mistakes that a table of numbers hides.
5. **Test the hypothesis.** The scientific method doesn't try to prove a hypothesis right. It tries to **disprove** it. If a fair attempt fails, the hypothesis survives, for now. Report how sure you are, too: a result with its **statistical confidence**, like a confidence interval, says how much the answer could change by chance.

Then revisit. Exploring often turns up something unexpected, and that becomes a **sub-hypothesis** worth its own trip around the loop.

## Try it

Let's test the hypothesis from step 1 with a year of solar data for the Lower East Side. Install pixi by following its [installation guide](https://pixi.prefix.dev/latest/installation/), then:

```sh
pixi init solar-research                          # create a new project folder with a pixi.toml
cd solar-research
pixi add python numpy pandas matplotlib marimo    # install Python and the libraries, and record them
pixi run marimo edit solar.py                     # create the notebook and open it in your browser
```

Type each block below into its own cell, and run it with the ▶ button or `Shift+Enter`. marimo shows the last line of each cell as its output. Each variable name can be defined in only one cell, because that's how marimo tracks which cells depend on which.

Import the libraries:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

**Load** a year of daily solar energy from the free [Open-Meteo](https://open-meteo.com/en/docs/historical-weather-api) weather API:

```python
url = (
    "https://archive-api.open-meteo.com/v1/archive"
    "?latitude=40.71&longitude=-73.99"  # the Lower East Side
    "&start_date=2025-01-01&end_date=2025-12-31"
    "&daily=shortwave_radiation_sum"  # solar energy per day
    "&timezone=America/New_York&format=csv"
)
raw = pd.read_csv(url, skiprows=3)  # skip 3 lines describing the location
raw
```

**Clean and transform** it into the shape we need:

```python
df = raw.rename(columns={"time": "date", "shortwave_radiation_sum (MJ/m²)": "solar"})
df["date"] = pd.to_datetime(df["date"])  # text → real dates
df = df.dropna()  # drop days with missing readings
df["month"] = df["date"].dt.month  # 1 = January ... 12 = December
df
```

**Explore** with a chart of the average day in each month:

```python
monthly = df.groupby("month")["solar"].mean()  # average day in each month
monthly.plot(kind="bar", xlabel="Month", ylabel="Solar energy per day (MJ/m²)")
plt.gca()
```

**Test** the hypothesis, with a confidence interval:

```python
jan = df[df["month"] == 1]["solar"].to_numpy()
jul = df[df["month"] == 7]["solar"].to_numpy()

# Resample the days 10,000 times to see how much the ratio varies by chance
rng = np.random.default_rng(0)
ratios = [rng.choice(jul, len(jul)).mean() / rng.choice(jan, len(jan)).mean() for _ in range(10_000)]
low, high = np.percentile(ratios, [2.5, 97.5])
f"July ÷ January = {jul.mean() / jan.mean():.2f}, 95% confidence interval {low:.2f} to {high:.2f}"
```

When we ran it, July got about 2.6 times January's solar energy, with a 95% confidence interval of about 2.3 to 3.1. The whole interval is above 2, so our attempt to disprove the hypothesis failed, and it survives.

Now look back at the chart. June has the longest days of the year, but July comes out sunnier, and December is darker than January. Each of those is a sub-hypothesis to chase: maybe clouds matter as much as day length. Try changing a number in the `url`, like the year, and watch every cell below it rerun.

Weather data by [Open-Meteo.com](https://open-meteo.com/), under [CC BY 4.0](https://open-meteo.com/en/license).

## Primary sources

- [pixi documentation](https://pixi.prefix.dev/)
- [marimo documentation](https://docs.marimo.io/)
- [NumPy](https://numpy.org/) · [pandas](https://pandas.pydata.org/) · [Matplotlib](https://matplotlib.org/) · [SciPy](https://scipy.org/)
- [Open-Meteo Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api)

## Learn more

- [Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/): NumPy, pandas, and Matplotlib in depth (it uses Jupyter).
- [Jupyter](https://jupyter.org/): the other common notebook tool.
- [Khan Academy: Significance tests](https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample): how statistical confidence and hypothesis tests work.
