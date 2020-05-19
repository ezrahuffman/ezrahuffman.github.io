using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ComplexShooting_Controller : MonoBehaviour
{
    public Transform ProjectileSpawn;
    public GameObject ProjectilePrefab;
    [Range(0f,-360f)]
    public float maxRotation; //max rotation barrel can be turned to
    [Range(-360,0f)]
    public float minRotation; //min rotation barrel can be turned to
    private GameObject target;
    private GameObject projectile;
    [Range(0f, 50f)]
    public float projectileSpeed;
    public float radius;
    public GameObject barrel;
    [Range(0f, 1f)]
    public float smoothSpeed;

    public LayerMask layerMask; //determines what the raycast "sees" when targeting the player
    public float fireRate;
    private float timer;
    public int dmg;
    private Vector3 rotationPoint;

    public void Start()
    {
        target = GameObject.FindGameObjectWithTag("Player");   //set player as target
        timer = Time.time + (1 / fireRate); //setting timer to inverse of fire rate
        float barrelLength = barrel.GetComponent<SpriteRenderer>().bounds.extents.y; //length of barrel
        rotationPoint = barrel.transform.position + new Vector3(barrelLength, 0, 0); //rotation point of the barrel
    }

    public void Update()
    {
        Aim();
        //on Timer
        if (Time.time > timer)
        {
            timer = Time.time + (1 / fireRate);
            //spawn projectile with velocity
            projectile = GameObject.Instantiate(ProjectilePrefab, ProjectileSpawn.position, Quaternion.identity);
            projectile.GetComponent<ProjectileController>().dmg = dmg;
            projectile.GetComponent<Rigidbody2D>().velocity = (ProjectileSpawn.up * projectileSpeed);
            //TODO: add ray to player transform (or if player can be seen)
        }
    }

    private void Aim()
    {
        if (target != null)
        {
            RaycastHit2D hit = Physics2D.Raycast(transform.position, target.transform.position - ProjectileSpawn.position, radius, layerMask);
            Debug.DrawLine(transform.position, target.transform.position);
            //if in radius and "visable"
            //NOTE: if this is not working check the mask is not set just to player in editor
            if (hit.distance != 0 && hit.collider.CompareTag("Player"))
            {
                //aim barrel at target
                Vector3 distance = hit.transform.position - rotationPoint;
                distance.Normalize();
                float rotation = (Mathf.Atan2(distance.y, distance.x) * Mathf.Rad2Deg) - 90;
                //Debug.Log("rotation = " + rotation);
                if (rotation <= minRotation)
                {
                    //set barrell angle to max rotatoin
                    rotation = minRotation;
                }
                if (rotation >= maxRotation)
                {
                    //set barrel to max rotation and don't fire
                    rotation = maxRotation;
                }
                float targetAngle = Mathf.LerpAngle(barrel.transform.eulerAngles.z, rotation, smoothSpeed);
                targetAngle -= barrel.transform.eulerAngles.z;
                barrel.transform.RotateAround(rotationPoint, Vector3.forward, targetAngle);
            }
        }
        else
        {
            Debug.Log("no target");
            target = GameObject.FindGameObjectWithTag("Player");
        }
    }
}
