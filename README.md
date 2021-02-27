# swiss-army-spoon

This is a collection of scripts and things to mess around with PGP
and cryptography in general.

I don't like PGP. I really don't like PGP.

It's old, bloated, and confusing.

It locks you into it's own ecosystem based on what it thinks is best for you.
If you want to figure something out which is non-standard, you'll probably
need to comb through several RFC's and/or take a deep dive through the GPG source.

PGP is the perfect example of why people find cryptography confusing in my opinion.

A friend of mine once asked me why I hate PGP, and this was my response (edited):

> PGP is kinda like a 50-tool swiss army knife that you got from your grandfather.
> The knife is dull and it doesn't open all the way because the scissors are broken.
> Now, imagine trying to use that as a spoon.

This isn't the best analogy and doesn't really make a lot of sense now that I think
about it, but it gave me an interesting repository name.

There are 2 parts to this repository as of now:

- `pgp-extract` - a couple of scripts to extract data from a PGP keychain.
  I used a modified form of this to extract an ed25519 SSH key from my keychain
  (since [StackExchange didn't help](https://superuser.com/q/1414381))

- `sigchain` - an attempt of making a descriptive sigchain containing all of the keys
  that I use. A cryptographic key is just a set of numbers when you boil it down, this
  is just an attemt to make it easier to understand the process of transforming those
  numbers into the public key signatures that programs like.
