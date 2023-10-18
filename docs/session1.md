---
title: Session 1 - Git and Python for data science
sidebar_position: 3
---

# Git and Python for data science

## Reproducibility

What do we want to achieve? In layman's terms, if someone clones your repository, runs your code according to the instructions in the README, they should get the same result as you. To do this we can use several tools (non-exhaustive list):
- Git - it takes care of versioning your code.
- Conda/pip/poetry - (these are Python specific), you will likely use some external libraries for your work (e.g. pandas, scikit, torch, etc.), so to run your code these must be installed. These tools define what libraries are used in a single text file and then try to recreate that environment on any PC with a single command.
- Docker - if your model or API needs to be deployed in production, you put it in a Docker container, more on this in a later tutoring session.

:::note
These tools enable reproducibility but don't guarantee it. Therefore, the only real test if your environment is reproducible is to try and clone the repository and create the environment yourself. Even if this works, there is no guarantee that it will work on another system. Reproducibility in general is not a solved problem.*
:::

:::note
There is more to reproduciblity than just code and environments: where and how do we distribute the data needed for training/evaluation? What do we use to share the hyperparameters of the models used in the study? How do we ensure that the random 70:30 train-test split is the same every time?*
:::

The instructions for reproducing should always be written in the repository README along with any instructions on where and how to get the data. We will focus on git for versioning our code and conda for defining our environments as this is what you need for the IDS course.

### The things that we will do to ensure reproducibility in the IDS course
- All code will be in git (and on Github).
- The csv files containing the data will be stored directly in git - this is rarely the case in practice as there can be too much data, or the data is binary (audio, video, text, images) and doesn't belong in git at all.
- The environments will be created with conda and the `environment.yml` file that defines the environment will be in the git repository.
- The README will contain ALL instructions needed to run the code.
- We will seed all randomness in our code.
- Later when we learn about Docker, all dockerfiles and docker compose files will be in the repository.


## Git

This is the tool you use to save your work (code), sync it to other computers, collaborate with others and help with reproducibility. Code is just a text file with a fancy file extension. Before you might have kept different versions of your code in separate folders and it was hard to remember what you added in each new revision, then if you wanted to share the code you had to send the newest folder etc. This changes today as you start using Git - a version control system that was designed to solve these issues.

![Basic git](img/remotes.jpg)
[image source](https://jlord.us/git-it/challenges/remote_control.html)

### Core terminology
- repository - like a folder with your code. It stores everything along with the changes of every file. This is why you can look at the history of every file and who changed what and when.
- remote - the remote server where your code is pushed (stored)
- commit - a snapshot of the current state of your project. This allows you to save your current work.
- branch - when you want to add a new feature or fix something, you tipically create a copy of the current state of the re1pository (copy of the main/master branch) and fix it there, once you are sure the new functionality or the fix works, you merge that into the master branch. This means that if halfway through adding a feature, the client decides to ditch it, you can just delete the branch for the feature and be back on track. **The goal is for the master branch to always have a working copy of your project. Other branches can contain work that can't be deployed yet.**
- checkout - git terminology for switching between branches
- .gitignore - a special text file that defines which files git won't track. For example if your data is 3GB of videos, you don't want to track those files and later push them to Github. The same goes for files containing sensitive information like API keys and passwords. So if you have a folder `data` that holds images you use to train models, than `data` should be in .gitignore

### Git vs Github
Git is a version control system that tracks your project, commits changes, pushes/pulls repositories and commits to a platform (server) that supports git. One such platform is Github. You can use git locally without Github to track changes for yourself, but if you want to share the repository with someone, you need to push it to some platform that knows how to speak git, i.e. Github, Gitlab, Bitbucket, etc. 

### What should and shouldn't be tracked in git

One sentence rule of thumb: put in git anything that is plain text and is not sensitive (not a password, API key) or user-environment-specific (like paths to data on the users computer).

Anything binary (things you can't open in a text editor) like images, video, audio generally should NOT be in git.

### Workflows
Over the years, [many approaches](https://www.abtasty.com/blog/git-branching-strategies/#trunk-based-development) on how to use git were developed (git flow, Github flow, trunk-based development, etc.).

However, these are approaches that are complex and meant for more professional work with many collaborators on the same repository. Since you'll be working on your own for the majority of the projects during your studies, while other times you will have max. 3 collaborators, I decided to introduce two approaches.

#### Single person project
This will be most of your work. Since you have no collaborators, and the projects are small, you can just use the master branch for everything. As you are alone, it's still very easy to rollback commits if you break your code and you will be implementing features sequentially anyway. More branches will just mean extra work.

#### Team project
From the beginning you want to have two branches that are NEVER deleted.:
- master - this always contains a working copy of your work - features may be missing, but those that are implemented, work.
- develop - this is the branch your team works on. When a collaborator decides to add a feature, he/she creates his/her own branch from the develop branch and works on it. Once the feature is complete, the branch is merged into develop and deleted. When enough progress is made to the point it makes sense to release a new version, develop is merged into master. For the next feature, the collaborator again creates his branch from develop and repeats the loop.

![Proposed team workflow](img/git_team_workflow.png)

[image source](https://lutece.paris.fr/support/wiki/git.html)

To motivate: on projects where the product is a web application (like an API), the pipeline is usually set in a way that it automatically deploys whatever is on master. That's why master always needs to have a working copy. Otherwise, you might push a bug to master and take down the whole app. The deployment of the app can take a long time, this is why you need the develop branch so you release a bunch of features at once to minimize downtime. Otherwise you would trigger a new release on every small addition resulting in your app being down all the time. This is even worse if you are exposing a predictive model which is retrained on every deployment.

This is also how your projects for the DS project competition will need to be structured.

## Conda

Let's say that for our project we want to use Python 3.10, along with the pandas external library (don't worry, you can add more libraries on the fly should you need them). We start by creating the Python environment. Think of the environment as a separate installation of Python with only the libraries you need for a specific project and nothing more.

### Creating a new environment
```bash
conda create -n my_env python=3.10
```
The above creates a Python 3.10 environment (you may or may not specify the exact version). Next, we have to tell our system to use that environment for Python and not the default (`base`) one. In other word, when we execute `python script.py` we want the `python` to refer to the Python in our environment, not the one that comes with our system. We do this by activating the environment:
```bash
conda activate my_env
```
Ok so we have a fresh installation of Python 3.10. Now let's install pandas in it.
```bash
conda install -c conda-forge pandas
```
What's this `-c conda-forge` switch you ask? Conda has its own default channel of packages available for installation. The default channel doesn't always contain what you need, so other channels are available and you can specify them with `-c channel_name`. `conda-forge` is very popular and has tons of packages. If the default channel doesn't have a library you are looking for, then it's a good idea to try with `-c conda-forge`. Personally, I always use `-c conda-forge` and haven't had any issues yet. 

That's it. At this point it's also a good idea to save the environment to a file so that we can reproduce it later (don't forget to do this when you add new packages too).

### Exporting an environment for reproducibility
We can export the environment to environment.yml with the following command:
```bash
conda env export > environment.yml
```

If we take a look at the exported file we see something like:
```yaml
name: my_env
channels:
- conda-forge
dependencies:
...
- numpy=1.26.0=py310hb13e2d6_0
- openssl=3.1.3=hd590300_0
- pandas=2.1.1=py310hcc13569_1
- pip=23.3=pyhd8ed1ab_0
- python=3.10.12=hd12c33a_0_cpython
- python-dateutil=2.8.2=pyhd8ed1ab_0
- python-tzdata=2023.3=pyhd8ed1ab_0
- python_abi=3.10=4_cp310
...
```
You probably noticed two things:
1. There are a lot more dependencies than you expected (remember, we installed just Python and pandas)
2. There are weird strings after the second `=` in each dependency line.

To address the first point, remember that pandas is just a bunch of python files packaged in a single module (library). This means that those files can also use any other libraries that you don't need yourself. In tech speak, pandas *depends* on a lot of other libraries, one of them being numpy.

Focusing on the second point, these strings define the builds. Packages like numpy are built (compiled) for a specific system architecture (the most popular being x86) for a specific OS. To differentiate between numpy 1.26.0 for Linux for x86 and numpy 1.26.0 for MacOS for M1 macbooks we use these build strings. Now, what will happen if I'm using Linux on a x86 laptop (basically all laptops, apart from the M1/M2 macbooks), export the environment and give you the `environment.yml` file to reproduce on your shiny new M2 macbook? Suddenly (some) builds might lead to packages that are not available/don't work on the M2 which means that you won't be able to recreate my environment. This is why reproduciblity is hard and isn't a solved problem.

Why not just remove the builds then and say 'ok conda, just install any numpy 1.26.0 you can'? This is better and can be done in conda with:
```bash
conda env export --no-builds > environment.yml 
```
The result will look something like this:
```yaml
name: my_env
channels:
- conda-forge
dependencies:
...
- numpy=1.26.0
- openssl=3.1.3
- pandas=2.1.1
- pip=23.3
- python=3.10.12
- python-dateutil=2.8.2
- python-tzdata=2023.3
- python_abi=3.10
...
```
However, what if some dependency is only needed on Windows and not on Linux? Then conda will try to install a package that doesn't exist for Linux and the environment again won't be reproducible.

What we can do though, is only list the packages we explicitly installed through `conda install` and expect that the target system will have some version of those. This can be done with:
```bash
conda env export --from-history > environment.yml
```
The resulting environment.yml is:
```yaml
name: my_env
channels:
- conda-forge
dependencies:
- pandas
- python=3.10
```
This is currently the [conda recommended way to do cross-platform environment sharing](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#exporting-an-environment-file-across-platforms) and it **should** work. Again, it isn't guaranteed. An example of when this crashes and burns is if a package we explicitly installed simply isn't available through conda on the target system. From personal experience (DS Project Competition): OpenCV needs to be compiled from source to run on the Jetson nano with CUDA support. This is impossible to solve using only conda and is where docker comes in.

### Restoring an environment
To restore an environment, we just tell conda to create a new environment from a given `environment.yml`:
```bash
conda env create -f environment.yml
```
and then we can activate it (the name is also defined in environment.yml)
```bash
conda activate my_env
```

## Python for data science

Python benefits from a huge ecosystem of libraries to do basically anything. Here are some that you might find useful (those that I think are directly applicable for your projects are marked with **[recommended for IDS]**), you can use anything else though as long as you achieve the goal.

:::note
Some of these are opinionated choices and/or things that I've encountered on my limited sample size of industry projects, I am nowhere near an expert. I've tried to stick to popular libraries (based on stackoverflow surveys, pip installs and github trends). As always you should do your own research.*
:::

We won't go over all of these on the tutoring session, I've just listed them here so that you know they exist or what to search for if/when you are doing your own research.


### Useful builtin modules

These are libraries that come bundled with Python and you can just import without installing anything else:
- [argparse](https://docs.python.org/3/library/argparse.html) - when you need to create a command line interface (CLI), so you can give variable values directly from the terminal when executing the script, e.g. `python script.py --input-file my_data.csv --verbose`. For a popular external alternative see [typer](https://typer.tiangolo.com/).
- [datetime](https://docs.python.org/3/library/datetime.html) - working with dates and times
- [os](https://docs.python.org/3/library/os.html) - working with directories (list and walk) and files (copy, remove)
- [sys](https://docs.python.org/3/library/sys.html) - getting info about the host system
- [re](https://docs.python.org/3/library/re.html) - using regular expressions (regex)
- [random](https://docs.python.org/3/library/random.html) - generating random numbers
- [unittest](https://docs.python.org/3/library/unittest.html) - for writing code tests. One popular external alternative: [pytest](https://docs.pytest.org/en/7.4.x/)
- [profile](https://docs.python.org/3/library/profile.html) - which functions in my script take the longest time to execute? useful for knowing what to optimize
- [timeit](https://docs.python.org/3/library/timeit.html) - run the same function multiple times and measure how long it takes to execute on average
- [sqlite3](https://docs.python.org/3/library/sqlite3.html) - when you need an SQL database that can be saved and read from a single file
- [json](https://docs.python.org/3/library/json.html) - parse/save json
- [tarfile](https://docs.python.org/3/library/tarfile.html) - read/write .tar archives
- [gzip](https://docs.python.org/3/library/gzip.html) - read/write .gz archives
- [zipfile](https://docs.python.org/3/library/zipfile.html) - read/write zip archives

You can find all available builtin modules [here](https://docs.python.org/3.12/library/index.html) (be careful to select the Python version you are using on the left as the modules change).


### Useful external libraries

<details>
    <summary>
    <a href="https://pandas.pydata.org/">pandas</a> - reading, saving, and manipulating tabular data <strong>[recommended for IDS]</strong>
    </summary>

If you are working with tabular data, it should be in a pandas dataframe (a table). It knows how to read and save in a lot of popular formats (from csv and excel to binary formats like feather) while also exposing a simple interface for selecting data and computing some basic statistics. It also integrates well with other libraries (i.e. seaborn).

A use case example:
```python
import pandas as pd

# Load the data from a CSV file
sales_data = pd.read_csv('sales_data.csv')
# Display the first few rows of the data
print(sales_data.head())
# Get basic statistics about the data (min, mean, max, number of missing values etc.)
summary_stats = sales_data.describe()
# Calculate the total sales for the team
total_sales = sales_data['SalesAmount'].sum()
# Find the top salesperson
top_salesperson = sales_data.loc[sales_data['SalesAmount'].idxmax()]
# Filter data for high-performing salespeople
high_performers = sales_data[sales_data['SalesAmount'] > 10000]
# Group the data by sales region and calculate the average sales for each region
avg_sales_by_region = sales_data.groupby('Region')['SalesAmount'].mean()
# Save the computed metrics to CSV files
summary_stats.to_csv('summary_stats.csv')
top_salesperson.to_frame().T.to_csv('top_salesperson.csv')
high_performers.to_csv('high_performers.csv')
avg_sales_by_region.to_frame().to_csv('avg_sales_by_region.csv')
```
</details>

<details>
    <summary>
    <a href="https://matplotlib.org/3.5.3/api/_as_gen/matplotlib.pyplot.html">matplotlib</a> - drawing pretty charts <strong>[recommended for IDS]</strong>
    </summary>

This is the go-to library for drawing graphs in Python. You can draw anything from bar charts to box and scatter plots.

A use case example:
```python
import pandas as pd
import matplotlib.pyplot as plt

# Create a Pandas DataFrame with sales data
data = {
    'Region': ['East', 'East', 'North', 'North', 'West', 'West', 'South', 'South'],
    'Year': [2020, 2021, 2020, 2021, 2020, 2021, 2020, 2021],
    'Sales': [50000, 55000, 52000, 60000, 48000, 52000, 45000, 49000]
}

df = pd.DataFrame(data)

# Define unique regions and years
regions = df['Region'].unique()
years = df['Year'].unique()

# Set the width of each bar
bar_width = 0.35
index = range(len(regions))

# Create grouped bars by iterating over years
plt.figure()

for i, year in enumerate(years):
    sales_by_year = df[df['Year'] == year]
    sales = [sales_by_year[sales_by_year['Region'] == region]['Sales'].values[0] for region in regions]
    plt.bar([pos + bar_width * i for pos in index], sales, bar_width, label=str(year))  # Convert year to string

plt.xlabel('Region')
plt.ylabel('Sales')
plt.title('Sales by Region and Year (Matplotlib)')
plt.xticks([pos + bar_width for pos in index], regions)
plt.legend(title='Year')
plt.savefig('grouped_sales_matplotlib.pdf')
```
![matplotlib barchart](img/grouped_sales_matplotlib.png)
</details>

<details>
    <summary>
    <a href="https://seaborn.pydata.org/">seaborn</a> - drawing pretty charts easily <strong>[recommended for IDS]</strong>
    </summary>

matplotlib can be a bit clunky to use. It also doesn't know how to directly work with pandas dataframes. This is why over the years, many libraries were built on top of matplotlib to offer an easier way of doing basic charts. One of these is seaborn which knows how to work with dataframes directly (you just specify the column name), as well as some sensible defaults and functionality (knows how to group by category without you having to do it manually with for loops, knows how to compute confidence intervals, includes a legend automatically when needed, etc.).

Let's draw the same barchart as in the matplotlib section.

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Use the default theme (many available)
sns.set_theme()

# Create a Pandas DataFrame with sales data
data = {
    'Region': ['East', 'East', 'North', 'North', 'West', 'West', 'South', 'South'],
    'Year': [2020, 2021, 2020, 2021, 2020, 2021, 2020, 2021],
    'Sales': [50000, 55000, 52000, 60000, 48000, 52000, 45000, 49000]
}
df = pd.DataFrame(data)

# Use Seaborn to create a grouped bar chart (sales per year grouped by region)
plt.figure()
sns.barplot(x='Region', y='Sales', hue='Year', data=df)
plt.xlabel('Region')
plt.ylabel('Sales [EUR]')
plt.title('Sales by region and year')
plt.savefig("grouped_sales_seaborn.pdf")
```
![bar chart](img/grouped_sales_seaborn.png)

See how much less code it took?
</details>

<details>
    <summary>
    <a href="https://numpy.org/">numpy</a> - vector and matrix math <strong>[recommended for IDS]</strong>
    </summary>

If you need to do math (matrix/vector computations) that runs quickly, you use this. Other libraries (pandas, scikit-learn, torch, etc.) all use it under the hood.

Showcase:
```python
import numpy as np

# Creating and manipulating 1D data (vectors)
vector = np.array([1, 2, 3, 4, 5])

# Element-wise operations on the vector
vector_squared = np.square(vector)  # Square each element
vector_sqrt = np.sqrt(vector)  # Calculate the square root of each element
vector_sum = np.sum(vector)  # Sum of all elements

# Matrix operations
matrix_A = np.array([[1, 2], [3, 4]])
matrix_B = np.array([[2, 0], [1, 3]])

# Matrix multiplication
matrix_result = np.dot(matrix_A, matrix_B)

# Statistics
data = np.array([10, 20, 30, 40, 50])
mean = np.mean(data)
std_dev = np.std(data)
min_value = np.min(data)
max_value = np.max(data)
```
</details>

<details>
    <summary>
    <a href="https://scipy.org/">scipy</a> - mainly math and stats functions that you would have to implement manually in numpy
    </summary>

scipy provides many specialized functions for hypotesis testing, probability distributions, t-tests, integration, interpolation, correlation coefficients, distance matrices etc. that you would have to implement manually in numpy.

An example of computing Pearson correlation coefficient:
```python
import numpy as np
from scipy import stats

# Create sample data
variable1 = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
variable2 = np.array([2, 4, 5, 7, 8, 10, 11, 13, 14, 16])

# Calculate the Pearson correlation coefficient
correlation_coefficient, p_value = stats.pearsonr(variable1, variable2)

print(f"Pearson Correlation Coefficient: {correlation_coefficient:.2f}")
print(f"P-Value: {p_value:.2f}")

if p_value < 0.05:
    print("There is a statistically significant correlation.")
else:
    print("There is no statistically significant correlation.")

```
</details>

<details>
    <summary>
    <a href="https://scikit-learn.org/stable/">scikit-learn</a> - shallow predictive models <strong>[recommended for IDS]</strong>
    </summary>

This is what you use for fitting most shallow predictive models (regression, SVM, random forests, etc.). It provides a very consistent interface to all models along with many supporting functions for hyperparameter optimization, metric computations, clustering, model selection, dimensionality reduction, data preprocessing etc.

An example of fitting a random forest to the breast cancer dataset:
```python
# Import scikit-learn and load a more complex dataset
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load the Breast Cancer dataset
data = load_breast_cancer()
X = data.data  # Features
y = data.target  # Target labels

# Split the dataset into a training set and a test set
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Initialize a Random Forest classifier
rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)

# Fit the classifier to the training data
rf_classifier.fit(X_train, y_train)

# Make predictions on the test set
y_pred = rf_classifier.predict(X_test)

# Calculate the accuracy of the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy*100:.2f}%")
```
</details>

<details>
    <summary>
    <a href="https://xgboost.readthedocs.io/en/stable/#">xgboost</a> - gradient boosting models
    </summary>

A library that implements gradient boosting models. **In my limited experience**, when I got a prebuilt predictive model from the industry, it was most likely xgboost or a random forest from scikit.

Example on the same dataset as scikit above:
```python
import xgboost as xgb
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load the Breast Cancer dataset
data = load_breast_cancer()
X = data.data  # Features
y = data.target  # Target labels (0 or 1)

# Split the dataset into a training set and a test set
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Initialize and configure the XGBoost classifier
xgb_classifier = xgb.XGBClassifier(
    learning_rate=0.1,
    n_estimators=100,
    max_depth=3,
    objective="binary:logistic",
    random_state=42
)

# Fit the classifier to the training data
xgb_classifier.fit(X_train, y_train)

# Make predictions on the test set
y_pred = xgb_classifier.predict(X_test)

# Calculate the accuracy of the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy*100:.2f}%")
```
</details>

<details>
    <summary>
    <a href="https://tqdm.github.io/">tqdm</a> - very simple progress bars for loops <strong>[recommended for IDS]</strong>
    </summary>

A quality of life library with the purpose of providing a progress bar for any loop along with a time left estimate. To use, you just wrap your list/generator with `tqdm()`.

Example:
```python
from tqdm import tqdm
import time

# Create a list of items to iterate through
items = range(10)

# Create a tqdm object to wrap the loop
for item in tqdm(items):
    # Simulate a time-consuming task
    time.sleep(0.5)

# The progress bar will update as the loop iterates, showing the progress.
```
</details>

<details>
    <summary>
    <a href="https://pypi.org/project/python-dotenv/">python-dotenv</a> - use environment variables to store sensitive/user specific information that doesn't belong in git.
    </summary>

It can happen that your program will require sensitive information (e.g. an API key to access some data) which should NOT be in version control. One of the ways you can solve this issue is with environment variables. These are variables that specific to your environment/pc. An example of an environment variable: if you type `echo $USER` in your terminal, you will print the environment variable `USER` which contains the username of the current user.

Let's say we want to access the database somewhere on the internet. To do so, we need the URL of the database and a key. Both of these should never be in git, so we create a file `.env` with the following contents:
```bash
DATABASE_URL="mysql://user:password@localhost/mydatabase"
SECRET_KEY="mysecretkey"
```
This file is in the same folder as our Python script. Then we can access these variables like this:
```python
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Access environment variables
database_url = os.getenv("DATABASE_URL")
secret_key = os.getenv("SECRET_KEY")

# Display the environment variables
print(f"Database URL: {database_url}")
print(f"Secret Key: {secret_key}")

access_database(database_url, secret_key) # ...
```
</details>

<details>
    <summary>
    <a href="https://pypi.org/project/requests/">requests</a> - query APIs
    </summary>

There are situations where you need to get the data on the fly and you can't have it saved locally. One such example is stock prices which change all the time. For getting and transforming such data, you can search for APIs on the internet. There are APIs for practically everything (stock prices, currency exchange rates, ChatGPT has an API you can prompt programatically, etc.). The requests library provides you with a simple interface to call such APIs.

To illustrate, we will use the [Quotable API](https://api.quotable.io/random) to get a random quote:
```python
import requests

# Define the API endpoint for a random quote
api_url = 'https://api.quotable.io/random'

# Make a GET request to the API
response = requests.get(api_url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()
    
    # Extract and display the random quote
    quote = data['content']
    author = data['author']
    print(f"Random Quote: '{quote}' - {author}")
else:
    print(f"Failed to fetch a random quote. Status code: {response.status_code}")

```
</details>

<details>
    <summary>
    <a href="https://fastapi.tiangolo.com/">FastAPI</a> - when you need to expose data/models/functions to the internet in the form of an API.
    </summary>

What if you have a predictive model (e.g. a random forest) that you would like to expose to the internet in the form of an API? This is where FastAPI comes in. It enables you to write APIs in in Python. This is great, because if your predictive model is written in Python (which is very likely), it's much easier to integrate it into a Python API than for example a Javascript API.

Let's create an API that exposes your car price prediction model that you fit in scikit:
```python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib

# Create a FastAPI app
app = FastAPI()

# Load a pre-trained scikit-learn model
model = joblib.load('your_car_price_model.pkl')

# Define a data model for input
class CarFeatures(BaseModel):
    mileage: float
    horsepower: float
    year: int

# Create a route for making price predictions
@app.post("/predict/")
def predict_price(data: CarFeatures):
    # Prepare the input data as a list
    input_data = [[data.mileage, data.horsepower, data.year]]

    # Use the pre-trained model to make price predictions
    predicted_price = model.predict(input_data)

    return {"predicted_price": predicted_price[0]}
```

Now we can send mileage, horsepower and year to `http://localhost:8000/predict` (remember when we talked about using the requests module to query APIs?) and we will get a response with the prediction!
</details>


<details>
    <summary>
    <a href="https://www.selenium.dev/">selenium</a> - automating your web browser <strong>[recommended for IDS]</strong>
    </summary>

Sometimes you would like to automate actions in your web browser (go to this page, type in the username and password, log in, get some data). This is when selenium comes into play. You use it to launch a web browser and programmatically send commands to it. You can use it for getting data (web scraping), testing web applications automatically, making bots (quickly buying things before they go out of stock etc.).

An example of navigating to a page, logging in and getting some text:
```python
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

# Launch a browser
driver = webdriver.Chrome(executable_path="/path/to/chromedriver")

# Go to a webpage
driver.get("https://example.com/login")

# Find and fill in the username and password fields
username_field = driver.find_element_by_id("username")  # Replace with the actual ID or name of the username input field
password_field = driver.find_element_by_id("password")  # Replace with the actual ID or name of the password input field
username_field.send_keys("your_username")
password_field.send_keys("your_password")

# Submit the login form (e.g., clicking the login button)
login_button = driver.find_element_by_id("login-button")  # Replace with the actual ID or name of the login button
login_button.click()

# Wait for the dashboard to load (you may need to adjust the wait time based on the webpage)
driver.implicitly_wait(10)

# Extract data from the dashboard
dashboard_data = driver.find_element_by_id("dashboard-data")  # Replace with the actual ID or name of the data element
data_text = dashboard_data.text

# Print the extracted data
print("Dashboard Data:")
print(data_text)

# Close the browser
driver.quit()
```
</details>

<details>
    <summary>
    <a href="https://www.crummy.com/software/BeautifulSoup/bs4/doc/">beautifulsoup</a> - when you need to extract data from static websites
    </summary>

beautifulsoup is a library for parsing HTML of websites (more on this in the web scraping tutorial session). If you want to acquire data from a very static page (no login, scrolling, closing pop ups required - e.g. wikipedia), it's enough to use just beautifulsoup without selenium.

Example of extracting article titles from a news site:
```python
import requests
from bs4 import BeautifulSoup

# Send an HTTP GET request to the web page
url = "https://example-news-site.com"
response = requests.get(url)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Parse the HTML content of the page using Beautiful Soup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find and extract the titles of articles (adjust the selectors for your specific case)
    article_titles = soup.find_all("h2", class_="article-title")  # Replace with actual HTML selectors

    # Display the extracted article titles
    for title in article_titles:
        print(title.text.strip())  # .strip() removes leading/trailing whitespace

else:
    print("Failed to fetch the web page. Status Code:", response.status_code)
```
</details>

<details>
    <summary>
    <a href="https://www.sqlalchemy.org/">sqlalchemy</a> - work with SQL databases from Python, the right way
    </summary>

Working with databases from a programming language can be tricky. Wouldn't it be great if we could define a Python class that would be an equivalent of a row in a database table and we could access it by column names instead of indices? This is where ORMs (object-relational mappers) like sqlalchemy come into play. Their only purpose is to take a predefined Python object and map it to a table row and vice-versa.

An example that illustrates how sqlalchemy integrates into working with a database:
```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Create a SQLite database and an SQLAlchemy engine
db_url = "sqlite:///mydatabase.db"
engine = create_engine(db_url)

# Define a base class for declarative models
Base = declarative_base()

# Define a data model (a table)
class Person(Base):
    __tablename__ = 'people'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

# Create the table in the database
Base.metadata.create_all(bind=engine)

# Create a new person
Session = sessionmaker(bind=engine)
db = Session()
new_person = Person(name="John Doe")
db.add(new_person)
db.commit()

# Query and print all people in the table
people = db.query(Person).all()
for person in people:
    print(f"ID: {person.id}, Name: {person.name}")
```
Notice how we defined a class Person that has an id and a name and then we could create and read to and from the database through Python objects instead of having to write SQL statements (sqlalchemy writes these behind the scenes).
</details>




<details>
    <summary>
    <a href="https://opencv.org/">opencv</a> - basic operations on images
    </summary>

This is what you use for working with images without neural networks for things like blurring, resizing, cropping, extracting edges, thresholding etc. Examples can be found [here](https://docs.opencv.org/4.x/examples.html).
</details>

<details>
    <summary>
    <a href="https://www.nltk.org/">nltk</a> - basic operations on human language (text)
    </summary>

For working with human language data - when you need to tokenize a string, remove stop words before feeding the input into a deep neural network. Examples can be found [here](https://www.nltk.org/howto.html)
</details>

<details>
    <summary>
    <a href="https://pytorch.org/">torch</a> - deep learning
    </summary>

This is what you use for deep learning (any kind of neural networks). There are many alternatives (tensorflow, JAX, etc.), however, this is what you will use in most courses that have projects in deep learning. Many additional libraries built on top of it exist (i.e. Lightning, ignite), do your own research. Examples are available [here](https://pytorch.org/tutorials/beginner/pytorch_with_examples.html).

</details>


## Putting things into practice
TODO


## FAQ
### What git platform should I use?
There are many available platforms (Github, Gitlab, Bitbucket, etc.). For the majority of use cases, it doesn't matter. It starts to matter if you start using platform specific functions (Github actions or Gitlab CI/CD). I would recommend you to just use Github. It's widely used and has introduced tons of useful features making it possible to use Github as the single source of truth for everything about your project (code, wikis, plans, etc.). These resources for the tutorial sessions are published with a feature called Github pages. If you want to delve into such Github features, take a look at [this](https://github.com/features) to see what's possible and how. If you want to learn more about making git your single source of truth, read up on "gitops".

### How do I seed randomness and what does it mean?
There are many cases where your code requires some random value - i.e. a random 70:30 train-test split needs random indices of rows, permutation testing requires random permutations etc. This causes issues with reproducibility as it's impossible to get the same results if each time you run your code you get different train-test splits (and therefore different models). This is the issue seeds solve. A seed is just a number you set as a starting point for the random number generator that Python uses under the hood. Take a look at the following snippet:
```python
import numpy as np

# Set a seed for reproducibility
seed_value = 42
np.random.seed(seed_value)

# Generate random numbers
random_numbers = np.random.rand(5)  # Generate 5 random numbers between 0 and 1

print("Random Numbers:")
print(random_numbers)
```
Here `random_numbers` will always contain the same 5 random numbers. If you use a different seed, then it will always contain some other 5 numbers. This means that you still have random numbers, however your experiments are repeatable. Don't forget to seed all random generators (numpy uses a separate generator and seed from the python's `random` builtin module, and scikit functions take a random_state parameter to define a seed).

### When to create a python (conda) environment?
Short answer: always (1 environment per project). Each project belongs in git and should be reproducible (therefore you should have an environment per project). Furthermore, if it's a group project, then a defined environment in the git repo is a must and should be project specific as everyone will use it when working on the project. At the very least, I would recommend one environment per course - e.g. you probably won't use pandas in a computer vision course, and you won't use opencv for IDS. However you probably will use opencv for all your computer vision projects, so you can have the same environment.

### Can I use pip inside a conda environment?
Yes, however, [it is highly discouraged](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#using-pip-in-an-environment) as it's an easy way to ruin your environment. If you still decide to do it, you have to follow one rule though: use pip after conda, as conda also tracks the packages you install with pip (these will be under the `pip` section in your exported environment.yml).

### I installed a package and the conda environment broke (some packages I previously installed don't work anymore)
Unfortunately, this sometimes happens. There are many possible reasons why. A simple one that comes to mind is that conda can change already installed packages. Let's say you have an environment with numpy 1.26.0 installed. Then you decide to install a library that also requires numpy, but at most of version 1.19.0. Conda will automatically uninstall your numpy 1.26.0 and install 1.19.0 and then install the package you wanted to add. Even worse, sometimes you will have unresolvable conflicts (for example consider adding another packages that wants numpy exactly 1.21.0), in that case conda can and sometimes will uninstall a package you explicitly installed, ruining your environment. The solution to this is to just create a new environment (debugging the old one is not worth it).

### If we're able to get the HTML of a page with beautifulsoup, are there any scenarios where it wouldn't be enough and we would need to use selenium?
Yes. Think about visiting an instagram profile: first only the skeleton of the page shows and then the pictures load in. beautifulsoup only sees the initial web page that is sent to you and therefore wouldn't be able to extract pictures as those are loaded in later with Javascript (remember, beautifulsoup speaks and knows only HTML and not Javascript). Furthermore, what if you want more than the first 15 pictures which are shown? You have to scroll down in order to trigger the loading of new pictures - you cannot do this with beautifulsoup.
