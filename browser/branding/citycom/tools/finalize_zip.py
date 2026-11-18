# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

"""Copy a packaged Firefox zip to its CityCom release name and add the French
language pack as a distribution add-on, which `mach package` leaves out for
builds not made by Mozilla."""

import argparse
import shutil
import zipfile

LANGPACK_PATH = "firefox/distribution/extensions/langpack-fr@firefox.mozilla.org.xpi"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("package", help="zip produced by `mach package`")
    parser.add_argument("langpack", help="French langpack .xpi")
    parser.add_argument("output", help="release zip to write")
    args = parser.parse_args()

    shutil.copyfile(args.package, args.output)
    with zipfile.ZipFile(args.output, "a", zipfile.ZIP_DEFLATED) as release:
        if LANGPACK_PATH not in release.namelist():
            release.write(args.langpack, LANGPACK_PATH)


if __name__ == "__main__":
    main()
