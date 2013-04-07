from setuptools import setup, find_packages

version = '0.1'

setup(
    name='mockup',
    version=version,
    description="No sure how should this package be named so please don't "
                "judge me just, yet",
    long_description=open("README.rst").read(),
    classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    keywords='plone mockup',
    author='Rok Garbas',
    author_email='rok@garbas.si',
    url='https://github.com/plone/mockup',
    license='GPL',
    packages=find_packages(),
    include_package_data=True,
    package_dir={'': 'plone'},
    zip_safe=False,
    install_requires=[],
    entry_points={
        'z3c.autoinclude.plugin': [
            "target = plone"
        ],
    },
)
