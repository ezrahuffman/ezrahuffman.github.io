using System.Collections.Generic;
using UnityEngine;

public class RainTiling : MonoBehaviour
{
    //TODO: only have neccessary varables be public (use get set)
    private Transform cam;
    private Vector3 prevCamPos;


    public float smoothing;
    public float screenWidth = 1920;
    public float screenHeight = 1080;
    public float cushin = 0f;
    //public int backgroundsIndex; //used for parallaxing

    public List<Transform> ogRainBoxTrans;
    private List<Rain> rainBoxes;

    private void Awake()
    {
        cam = Camera.main.transform;                                //Initialize cam position
        rainBoxes = new List<Rain>();                               //Initialize list
    }

    private void Start()
    {
        prevCamPos = cam.position;

        //initialization
        foreach (Transform transform in ogRainBoxTrans)
        {
            GameObject temp = Instantiate(transform.gameObject);    //Instantiate a copy of original background
            Rain bg = new Rain(temp.transform, this);               //Make new background from copy
            transform.gameObject.SetActive(false);                  //Deactivate original background obj
            rainBoxes.Add(bg);
        }
    }

    private void Update()
    {
        foreach (Rain rain in rainBoxes.ToArray())                  //Check edges of rain boxes
        {
            rain.CheckEdge();
        }

        //add back in for parrallaxing (need to update and add parrallax scale in Rain.cs as well)
        //if (rainBoxes != null)
        //{
        //    foreach (Rain rain in rainBoxes)
        //    {
        //        float parrallax = (prevCamPos.x - cam.position.x) * rain.ParrallaxScale;
        //        float backgroundTargetPosX = background.Trans.position.x + parrallax;
        //        Vector3 backgroundTargetPos = new Vector3(backgroundTargetPosX, background.Trans.position.y, background.Trans.position.z);

        //        background.Trans.position = Vector3.Lerp(background.Trans.position, backgroundTargetPos, smoothing * Time.deltaTime);
        //    }
        //}
    }

    //Remove rain box
    public void RemoveRainBox(Rain rn)
    {
        //Debug.Log("remove bg. bgs.size = " + backgrounds.Count);
        if (rainBoxes.Contains(rn))                                     //Check to see if rain object is in list
        {
            rainBoxes.Remove(rn);                                       //Remove rain object from list
        }
        else                                                            //Trying to remove rain object that is not in list
        {
            Debug.Log("Background " + rn.Trans.name + " not found in backgrounds, but you are trying to remove it.");
        }
    }

    //Add rain box
    public void AddRainBox(Rain rn)
    {
        if (!rainBoxes.Contains(rn))  //check to see if new rain object is in list
        {
            rainBoxes.Add(rn);        //Add rain object to list
        }
    }


}
