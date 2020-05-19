using UnityEngine;

public class Rain
{
    private RainTiling tiling;

    private Transform trans;
    private float xBound;
    private float yBound;
    private Vector3 difVec;

    private Rain rightRain;
    private Rain leftRain;
    private GameObject gameObj;

    private bool hasRightBuddy = false;
    private bool hasLeftBuddy = false;

    public Rain(Transform transform, RainTiling newTiling)
    {
        tiling = newTiling;
        //gameObj = GameObject.Instantiate(transform.gameObject); //create copy of gameobject to replicate
        gameObj = transform.gameObject;
        trans = transform;
        xBound = gameObj.GetComponent<ParticleSystem>().shape.scale.x / 2;
        //Debug.Log("xBound of rain = " + xBound);
        //parrallaxScale = transform.position.z * -1;
        difVec = new Vector3(xBound, 0, 0);
    }

    public bool HasRightBuddy
    {
        get
        {
            return hasRightBuddy;
        }

        set
        {
            hasRightBuddy = value;
        }
    }


    public bool HasLeftBuddy
    {
        get
        {
            return hasLeftBuddy;
        }

        set
        {
            hasLeftBuddy = value;
        }
    }

    public Transform Trans
    {
        get
        {
            return trans;
        }

        set
        {
            trans = value;
        }
    }

    //public float ParrallaxScale
    //{
    //    get
    //    {
    //        return parrallaxScale;
    //    }
    //}

    public void CheckEdge()
    {
        //check if edge is showing on right
        if (Camera.main.WorldToViewportPoint(trans.position + difVec).x < 1f && !hasRightBuddy)
        {
            //Debug.Log("made rain box on right");
            //instantiate flipped version of background on right side
            Vector3 backPos = new Vector3(trans.position.x + (xBound * 2), trans.position.y, trans.position.z);
            GameObject rightBgObj = GameObject.Instantiate(gameObj, backPos, this.trans.rotation); //TODO: check if "gameObj should be replaced with prefab
            rightBgObj.transform.localScale = new Vector3(trans.localScale.x, trans.localScale.y, trans.localScale.z);
            hasRightBuddy = true;
            rightRain = new Rain(rightBgObj.transform, tiling);
            rightRain.HasLeftBuddy = true;
            rightRain.leftRain = this;
        }
        //check if edge is showing on left
        if (Camera.main.WorldToViewportPoint(trans.position - difVec).x > 0f && !hasLeftBuddy)
        {
            //Debug.Log("made bg on left");
            //instatiate flipped version of background on left side
            Vector3 backPos = new Vector3(trans.position.x - (xBound * 2), trans.position.y, trans.position.z);
            GameObject leftBgObj = GameObject.Instantiate(gameObj, backPos, this.trans.rotation); //TODO: check if "gameObj" should be replaced with prefab
            leftBgObj.transform.localScale = new Vector3(trans.localScale.x, trans.localScale.y, trans.localScale.z);
            hasLeftBuddy = true;
            leftRain = new Rain(leftBgObj.transform, tiling);
            leftRain.HasRightBuddy = true;
            leftRain.rightRain = this;

        }


        //NOTE: this is a little off because the box is tilted and we are not finding the actual length it covers in the horizontal (ie need to find x component)
        if (Camera.main.WorldToViewportPoint(trans.position + difVec).x < 0f && hasRightBuddy)
        {
            //right is new
            tiling.AddRainBox(rightRain);
            rightRain.HasLeftBuddy = false;
            tiling.RemoveRainBox(this);
            if (leftRain != null)
            {
                GameObject.Destroy(leftRain.gameObj);
            }
            //Debug.Log("destroyed rain box on left");
            GameObject.Destroy(gameObj);
        }
        if (Camera.main.WorldToViewportPoint(trans.position - difVec).x > 1f && hasLeftBuddy)
        {
            //left is new
            tiling.AddRainBox(leftRain);
            leftRain.HasRightBuddy = false;
            tiling.RemoveRainBox(this);
            if (rightRain != null)
            {
                GameObject.Destroy(rightRain.gameObj);
            }
            //Debug.Log("destroyed rain box on right");
            GameObject.Destroy(gameObj);
        }
    }
}


