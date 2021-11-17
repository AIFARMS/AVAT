"""Adapted from:
    @fcakyon labelme2coco: https://github.com/fcakyon/labelme2coco/blob/master/labelme2coco/labelme2coco.py
    @License: GNU General Public License v3.0
"""

import numpy as np
import glob
import json
import os
import sys
import re
from os import listdir, path
import argparse
import shutil
from PIL import Image 
from PIL.ExifTags import TAGS
import exifread
import piexif
import cv2
import datetime

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(MyEncoder, self).default(obj)

def validate_file(f):
    if not os.path.exists(f):
        # Argparse uses the ArgumentTypeError to give a rejection message like:
        # error: argument input: x does not exist
        raise argparse.ArgumentTypeError("{0} does not exist".format(f))
    return f

#checking whether the images directory path is a valid one
def imagedir_path(path):
   if os.path.isdir(path):
        return path
   else:
        raise argparse.ArgumentTypeError(f"readable_dir:{path} is not a valid path")

#info section of the coco file
def info(filename):
    info ={}
    info["year"] = "2021"
    info["version"] = "1"
    info["description"] = ""
    info["contributor"] = ""
    info["url"] = ""
    info["date_created"]= str(datetime.datetime.now())
    return info

#license section of the coco file
def license(filename):
    license ={}
    license["id"] = 1
    license["name"] = "CC BY 4.0"
    license["url"] = "https://creativecommons.org/licenses/by/4.0/"
    return license

#category section of the coco file
def category(filename):
    category = {}
    category["id"] = 1
    category["name"] = 'pig'
    category["supercategory"] = 'Sus'
    return category

#image section of the coco file gets extracted from the AVAT json output
def image(im, imgid):
    image = {}
    image["id"] = imgid
    image["license"] = 1
    image["file_name"] = getfilenm(im)
    image["height"] = getshapeimg(im)[0]
    image["width"] = getshapeimg(im)[1]
    image["date_captured"] = getdateandtime(im)
    return image

#annotation section of the coco file gets extracted from the AVAT json output: only segmentation and bounding box 
def annotation(anno_dict, imfile, annoid, imgid):
    annotation = {}
    annotation["id"] = annoid
    annotation["image_id"] = imgid
    annotation["category_id"] = 1
    annotation["bbox"] = boundbox(anno_dict)
    annotation["area"] = area(anno_dict)
    annotation["segmentation"] = segmentation(anno_dict)
    annotation["iscrowd"] = 0
    return annotation

#extracting only annotations from the AVAT json output
def returnannotations(file):

    framenum =0
    annoslist=[]
    annos = json.load(file)["annotations"]
    for ann in annos:
        framenum +=1
        if ann is not None:
            annoslist.append(ann)
    return annoslist
    
#calculating the area of the bounding box by multiplying width by height of the bounding box
def area(annodict):
    area = 0
    try:
         if annodict['type'] == 'bounding_box':
              area = int(annodict['height'])*int(annodict['width'])
    except:
          area =[]
    return area

#bounding box
def boundbox(annodict):
  
    bb =[]
    try:
        if annodict['type'] == 'bounding_box':
             bb = [int(annodict['x']), int(annodict['y']), int(annodict['width']), int(annodict['height'])]
    except:
         bb =[]
    return bb
    
#segmentation information from the json output turned into a double array
def segmentation(annodict):
     points1=[]
     points2=[]
     if annodict['type'] == 'segmentation':
          points =annodict["points"]
          for dic in points:
             for key,value in dic.items():
                 points1.append(value)
                 points2 = [np.asarray(points1).tolist()]
     return points2

#for each image in the image filepath get the file name, append it to a list and sort by number
def image_files(path):
    list_of_files =[]
    files = glob.glob(path + '/*.jpg')
    for file in files:
        filenm = os.path.basename(file)
        list_of_files.append(filenm)
    list_of_files = sorted(list_of_files, key=lambda x:float(re.findall("(\d+)",x)[0]))
    return list_of_files

#image height and width for the coco file
def getshapeimg(imfile):
     im = Image.open(imfile)
     height = im.size[1]
     width = im.size[0]
     return height, width

#obtaining file name for the image
def getfilenm(imfile):
    filenm = os.path.basename(imfile)
    filenm.replace('frame', '')
    return filenm

#getting fileid 
def getfileid(imfile):
    filenm = os.path.basename(imfile)
    fileid = os.path.splitext(filenm)[0]
    return fileid
    
def getdateandtime(imfile):
    #im = Image.open(imfile)
    exif_dict = piexif.load(imfile)
    date = exif_dict.get("Exif")
    date1= date[piexif.ExiIFD.DateTimeOriginal] if 'piexif.ExifIFD.DateTimeOriginal' in date else None
    return date1

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Process command line arguments.')
    parser.add_argument("-p", '--path', dest="imagedirpath", required =True, type=imagedir_path, help='add path to image directory')
    parser.add_argument("-i", "--input", dest="filename", required=True, type=validate_file,
                        help="AVAT annotation file")
    parser.add_argument('--save_json',help='Save settings to file in json format')
    parser.add_argument('--save_folder', default='coco/',
                    help='Directory for saving coco file')
    args = parser.parse_args()
    
    if not os.path.exists(args.save_folder):
        os.mkdir(args.save_folder)
    save_json_path = (args.save_folder + 'annotations.coco.json')
    
    infor =[]
    licenses = []
    images = []
    categories = []
    annotations = []
    
    #initialize coco dictionary structure
    data_coco = {}
    
    f = validate_file(args.filename)
    #open the annotations (json file)
    f = open(f, 'r')
    
   #zeroing in on annotations
    annolist = returnannotations(f)
    n = len(annolist)
    print(n)
                          
    imagelist = image_files(args.imagedirpath)
    
    #for each image and annotation get the image id to connect the image and annotation, get the annotation and image information and add it to a list
    imgid=0
    annoid=0
    
    for file, anno in zip(imagelist, annolist):
        imgid +=1
        for d in anno:
            annoid +=1 
            if d["type"] == "bounding_box":
                a = annotation(d, file, annoid, imgid)
                annotations.append(a)
            elif d["type"] == "segmentation":
                seg = annotation(d, file, annoid, imgid)
                annotations.append(seg)
        fi = os.path.join(args.imagedirpath + file)
        i = image(fi, imgid)
        images.append(i)
    
    #info section will need to be constructed manually once for each dataset
    i = info(args.filename)
    l = license(args.filename)
    licenses.append(l)
    c = category(args.filename)
    categories.append(c)
    
    f.close()
    #add the collected and formatted annotations and image information to the coco file and save as json file
    data_coco["info"] = i
    data_coco["licenses"] = licenses
    data_coco["categories"] = categories
    data_coco["images"] = images
    data_coco["annotations"] = annotations
    json.dump(data_coco, open(save_json_path, "w", encoding="utf-8"), indent=4, separators=(',', ': '), cls=MyEncoder)