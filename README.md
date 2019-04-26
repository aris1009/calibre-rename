A simple script to rename a bulk of e-books in Calibre.  
Node.js must be installed in your system; script runs from command line:  
`node calibre_rename.js`  
All configuration is done from `config.json` file; adding a GUI is not a priority right now.

**query & query_term**  
   The Calibre query needed to get a list of books to be renamed. You can read more on Calibre queries here:  
[Calibre Search Interface](https://manual.calibre-ebook.com/gui.html#the-search-interface)  
   For now only a single field is supported.

**reg_replace**  
   Regex is used to remove unwanted parts in the book name.
Test your regex [here](https://regexr.com/).  
*Example*:  
`"reg_replace":"Microsoft|Word|\\.docx"`  
will remove all occurances of *Microsoft*, *Word* and *.docx* from the book name.  
It is case insensitive.

**padded_numbers_up_to_thousand**  
   If set `true`, will pad numbers 1 - 99, with two or three 0's, assuming the book is part of a series.
Calibre will sort the books in this order if name is not padded:  
*Book 1  
Book 10  
Book 11  
Book 2  
Book 20*  
which is not to my liking. Set it `false` to disable.

**enable_title_set**  
   Must be `true` for new names to be commited. `false` for testing or reviewing purposes.

**split_str**  
   Regex used to convert `stdout` into an array. No need to change.

**start_calibre_on_script_end**  
   Starts Calibre and exits command line if set to `true`.  
**Tested only on Linux Mint 19.1**, but should work on other Unix systems as well.

**write_to_log & write_to_log_commands**  
  First option creates a new .log file with renaming output for reviewing or book-keeping.
Second options logs commands used as well, ala *verbose* style.

Finally, **debug** outputs everything to console in case you're a freak :)

Thanks for you time!
