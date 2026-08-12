from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()


setup(name='semantic-markdown-converter',
      version='0.5.9',
      description='Chuyển đổi các định dạng liên kết có kiểu trong Markdown và hỗ trợ plugin Obsidian Neo4j.',
      long_description=long_description,
      long_description_content_type="text/markdown",
      url='https://github.com/HEmile/semantic-markdown-converter',
      packages=find_packages(),
      install_requires=['pyyaml', 'tqdm', 'py2neo', 'watchdog>=1.0.2',
                        'markdown', 'mdx-wikilink-plus'],
      entry_points={
          'console_scripts': ['smdc=smdc.convert:main', 'smds=smdc.stream:main']
      },
      classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
      ],
      author='Emile van Krieken',
      author_email='emilevankrieken@live.nl',
      license='MIT',
      zip_safe=False,
      python_requires='>=3.6',)