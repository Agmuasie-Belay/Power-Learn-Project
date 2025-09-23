import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
from wordcloud import WordCloud


st.title("CORD-19 Data Explorer")
st.write("Interactive exploration of COVID-19 research metadata.")


# Load dataset
@st.cache_data
def load_data():
df = pd.read_csv("data/metadata.csv")
df['publish_time'] = pd.to_datetime(df['publish_time'], errors='coerce')
df['year'] = df['publish_time'].dt.year
df['abstract_word_count'] = df['abstract'].fillna("").apply(lambda x: len(x.split()))
return df


df = load_data()


# Sidebar filters
year_range = st.slider("Select Year Range", int(df['year'].min()), int(df['year'].max()), (2020, 2021))
filtered = df[(df['year'] >= year_range[0]) & (df['year'] <= year_range[1])]


# Show data sample
st.subheader("Sample Data")
st.write(filtered[['title','authors','journal','year']].head())


# Publications by Year
st.subheader("Publications by Year")
year_counts = filtered['year'].value_counts().sort_index()
fig, ax = plt.subplots()
ax.bar(year_counts.index, year_counts.values)
ax.set_xlabel("Year")
ax.set_ylabel("Number of Papers")
st.pyplot(fig)


# Top Journals
st.subheader("Top Journals")
top_journals = filtered['journal'].value_counts().head(10)
fig, ax = plt.subplots()
top_journals.plot(kind='barh', ax=ax)
ax.set_xlabel("Number of Papers")
st.pyplot(fig)


# Word Cloud
st.subheader("Word Cloud of Titles")
titles = " ".join(filtered['title'].dropna().astype(str))
wordcloud = WordCloud(width=800, height=400, background_color='white').generate(titles)
fig, ax = plt.subplots()
ax.imshow(wordcloud, interpolation='bilinear')
ax.axis("off")
st.pyplot(fig)