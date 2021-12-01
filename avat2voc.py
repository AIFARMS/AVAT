#encoding:utf-8
"""Adapted from: 
   @bot66: https://github.com/bot66/coco2voc
   @Licensed under the MIT License"""

import os
import glob
import re
import json
import argparse
from PIL import Image
from lxml import etree
import xml.etree.cElementTree as ET
import time
from tqdm import tqdm

#extracting annotations from the AVAT json output
def returnannotations(file):
    f = open(file, 'r')
    framenum =0
    annoslist=[]
    annos = json.load(f)["annotations"]
    for ann in annos:
        framenum +=1
        if ann is not None:
            annoslist.append(ann)
    return annoslist
    
#extracting bounding box
def boundbox(annodict):
    bb =[]
    try:
        if annodict['type'] == 'bounding_box':
             bb = [int(annodict['x']), int(annodict['y']), int(annodict['width']), int(annodict['height'])]
    except:
         bb =[]
    return bb

#extracting height and width of the image
def getshapeimg(imfile):
     im = Image.open(imfile)
     height = im.size[1]
     width = im.size[0]
     return height, width

#extracting file name for the image
def getfilenm(imfile):
    filenm = os.path.basename(imfile)
    filenm.replace('frame', '')
    return filenm

#creating a sorted image file list
def image_files(imagedirpath):
    list_of_files =[]
    files = glob.glob(imagedirpath + '/*.jpg')
    for file in files:
        list_of_files.append(file)
    list_of_files = sorted(list_of_files, key=lambda x:float(re.findall("(\d+)",x)[0]))
    return list_of_files

def avat2voc(anno, imagedirpath, xml_dir):
    xml_content = []

    annolist = returnannotations(anno)
    #print(annolist)
    n = len(annolist)
    print(n)           
    
    #for each image and annotation, get the image id to connect the image and annotation, get the annotation and image information and add it to a list
    imagelist = image_files(imagedirpath)
    #print(imagelist)
    for file, anno in (zip(imagelist, annolist)):
        height = getshapeimg(file)[0]
        #print(height)
        width =getshapeimg(file)[1]
        #print(width)
        file_name = getfilenm(file)
        #print(file_name)
    
        xml_content.append("<annotation>")
        xml_content.append("     <folder>Annotation</folder>")
        xml_content.append("     <filename>"+str(file_name)+"</filename>")
        xml_content.append("     <size>")
        xml_content.append("     <width>"+str(width)+"</width>")
        xml_content.append("     <height>"+str(height)+"</height>")
        xml_content.append("     </size>")
        xml_content.append("     <segmented>0</segmented>")
        
        for d in anno:
            bbox = boundbox(d)
            print(bbox)
            if len(bbox) >0 :
                 xml_content.append("   <object>")
                 xml_content.append("     <name>pig</name>")
                 xml_content.append("      <pose>Unspecified</pose>")
                 xml_content.append("      <truncated>0</truncated>")
                 xml_content.append("      <difficult>0</difficult>")
                 xml_content.append("      <bndbox>")
                 xml_content.append("           <xmin>"+str(int(bbox[0]))+"</xmin>")
                 xml_content.append("           <ymin>"+str(int(bbox[1]))+"</ymin>")
                 xml_content.append("           <xmax>"+str(int(bbox[0]+bbox[2]))+"</xmax>")
                 xml_content.append("           <ymax>"+str(int(bbox[1]+bbox[3]))+"</ymax>")
                 xml_content.append("      </bndbox>")
                 xml_content.append("    </object>")
            else:
                 continue
        xml_content.append("</annotation>")

        x = xml_content

        xml_path = os.path.join(xml_dir,file_name.split('.')[-2] + '.xml')
        with open(xml_path, 'w+',encoding="utf8") as f:
                f.write('\n'.join(xml_content))
        xml_content[:]=[]

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="convert coco .json annotation to voc .xml annotation")
    parser.add_argument('--json_path',type = str ,help = 'path to json file.',default="./annotations/train.json")
    parser.add_argument('--output',type = str ,help = 'path to output xml files.',default="./train_xml")
    parser.add_argument('--path', type=str, help='path to images', default="./images")
    args = parser.parse_args()
    if not os.path.exists(args.output):
        os.mkdir(args.output)
    avat2voc(args.json_path, args.path, args.output)